import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  verifyGitHubToken,
  listUserRepositories,
  getRepositoryTreeAndFiles,
  createRepository,
  commitFilesToBranch,
} from './server/github';
import {
  verifyVercelToken,
  listVercelProjects,
  createVercelDeployment,
  getVercelDeploymentStatus,
} from './server/vercel';
import { generateCodeWithLLM, fetchBAiModels } from './server/ai';
import { encryptSecret, decryptSecret } from './server/crypto';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();

  // JSON Body Parser for large code file payloads
  app.use(express.json({ limit: '25mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ==========================================
  // 1. GitHub OAuth & API Endpoints
  // ==========================================

  // Returns GitHub OAuth Authorize URL for popup flow
  app.get('/api/auth/github/url', (req, res) => {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
    const redirectUri = `${appUrl.replace(/\/$/, '')}/auth/callback`;

    if (!clientId) {
      return res.status(400).json({
        error: 'GITHUB_CLIENT_ID is not configured in server environment variables.',
        instructions: 'You can configure GITHUB_CLIENT_ID or use a Personal Access Token with repo,user scopes directly in the UI.',
      });
    }

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo,user',
      state: Math.random().toString(36).substring(2),
    });

    const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
    res.json({ url, redirectUri });
  });

  // OAuth Callback Route (Popup Handler)
  app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
    const { code, error, error_description } = req.query;

    if (error || !code) {
      return res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 2rem; background: #090d16; color: #f87171;">
            <h2>Authentication Failed</h2>
            <p>${error_description || error || 'No authorization code provided'}</p>
            <script>
              setTimeout(() => window.close(), 3000);
            </script>
          </body>
        </html>
      `);
    }

    try {
      const clientId = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET missing on server.');
      }

      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const tokenData = await tokenRes.json();
      const accessToken = tokenData.access_token;

      if (!accessToken) {
        throw new Error(tokenData.error_description || 'Did not receive access token');
      }

      // Fetch basic user profile
      const userProfile = await verifyGitHubToken(accessToken);

      res.send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #090d16; color: #38bdf8;">
            <div style="text-align: center; padding: 2rem; border-radius: 12px; background: #0f172a; border: 1px solid #1e293b; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
              <div style="font-size: 36px; margin-bottom: 12px;">⚡</div>
              <h3 style="margin: 0 0 8px; color: #fff;">GitHub Connected!</h3>
              <p style="color: #94a3b8; font-size: 14px; margin: 0;">Closing popup and syncing workspace...</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({
                  type: 'OAUTH_AUTH_SUCCESS',
                  token: ${JSON.stringify(accessToken)},
                  user: ${JSON.stringify(userProfile)}
                }, '*');
                setTimeout(() => window.close(), 800);
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: sans-serif; padding: 2rem; background: #090d16; color: #f87171;">
            <h2>Token Exchange Error</h2>
            <p>${err.message}</p>
          </body>
        </html>
      `);
    }
  });

  // Validate GitHub Token (OAuth or PAT)
  app.post('/api/github/validate', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: 'Token is required' });

      const user = await verifyGitHubToken(token);
      res.json({ valid: true, user });
    } catch (err: any) {
      res.status(401).json({ valid: false, error: err.message || 'Invalid GitHub token' });
    }
  });

  // List Repositories
  app.post('/api/github/repos', async (req, res) => {
    try {
      const { token, perPage } = req.body;
      if (!token) return res.status(400).json({ error: 'Token is required' });

      const repos = await listUserRepositories(token, perPage || 30);
      res.json({ repos });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to list repositories' });
    }
  });

  // Fetch Tree & Files from Repo (Opción A)
  app.post('/api/github/repo-tree', async (req, res) => {
    try {
      const { token, owner, repo, branch } = req.body;
      if (!token || !owner || !repo) {
        return res.status(400).json({ error: 'token, owner, and repo are required' });
      }

      const result = await getRepositoryTreeAndFiles(token, owner, repo, branch || 'main');
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to fetch repository tree' });
    }
  });

  // Create New Repository (Opción B)
  app.post('/api/github/create-repo', async (req, res) => {
    try {
      const { token, name, description, isPrivate } = req.body;
      if (!token || !name) {
        return res.status(400).json({ error: 'token and repository name are required' });
      }

      const repo = await createRepository(token, name, description, isPrivate);
      res.json({ repo });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to create repository' });
    }
  });

  // Commit and Push to Branch (Atomic Git Trees & Commits API)
  app.post('/api/github/commit-and-push', async (req, res) => {
    try {
      const { token, owner, repo, branch, files, commitMessage } = req.body;
      if (!token || !owner || !repo || !files || !Array.isArray(files)) {
        return res.status(400).json({ error: 'Missing required parameters (token, owner, repo, files)' });
      }

      const result = await commitFilesToBranch(
        token,
        owner,
        repo,
        branch || 'main',
        files,
        commitMessage || 'feat: update code via Web AI Studio'
      );

      res.json({ success: true, ...result });
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Failed to commit files to GitHub' });
    }
  });

  // ==========================================
  // 2. Vercel API Endpoints
  // ==========================================

  app.post('/api/vercel/validate', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: 'Vercel token is required' });

      const user = await verifyVercelToken(token);
      res.json({ valid: true, user });
    } catch (err: any) {
      res.status(401).json({ valid: false, error: err.message });
    }
  });

  app.post('/api/vercel/projects', async (req, res) => {
    try {
      const { token } = req.body;
      if (!token) return res.status(400).json({ error: 'Vercel token is required' });

      const projects = await listVercelProjects(token);
      res.json({ projects });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/vercel/deploy', async (req, res) => {
    try {
      const { token, projectName, files, target } = req.body;
      if (!token || !projectName || !files) {
        return res.status(400).json({ error: 'token, projectName, and files are required' });
      }

      const deployment = await createVercelDeployment(token, projectName, files, target || 'production');
      res.json({ success: true, deployment });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/vercel/deployment-status', async (req, res) => {
    try {
      const { token, deploymentId } = req.body;
      if (!token || !deploymentId) {
        return res.status(400).json({ error: 'token and deploymentId are required' });
      }

      const status = await getVercelDeploymentStatus(token, deploymentId);
      res.json(status);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // ==========================================
  // 3. Supabase Validation Endpoint
  // ==========================================

  app.post('/api/supabase/validate', async (req, res) => {
    try {
      const { url, anonKey } = req.body;
      if (!url || !anonKey) {
        return res.status(400).json({ valid: false, error: 'Both URL and Anon Key are required.' });
      }

      // Ping Supabase PostgREST root endpoint
      const targetUrl = url.replace(/\/$/, '') + '/rest/v1/';
      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
        },
      });

      // PostgREST returns 200 with schema OpenAPI spec or 401 if key invalid
      if (response.status === 200 || response.status === 404) {
        res.json({ valid: true, message: 'Connected to Supabase successfully' });
      } else if (response.status === 401) {
        res.status(401).json({ valid: false, error: 'Invalid Supabase Anon Key' });
      } else {
        res.json({ valid: true, message: `Connected (status: ${response.status})` });
      }
    } catch (err: any) {
      res.status(400).json({ valid: false, error: `Connection failed: ${err.message}` });
    }
  });

  // ==========================================
  // 4. Flexible LLM Generation Endpoint (Gemini + B.AI + OpenRouter/DeepSeek)
  // ==========================================

  app.post('/api/ai/generate', async (req, res) => {
    try {
      const {
        prompt,
        systemPrompt,
        files,
        supabaseConfig,
        injectSupabase,
        provider,
        customEndpoint,
        customApiKey,
        customModel,
        bAiApiKey,
        bAiModel,
      } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Se requiere un prompt o instrucción' });
      }

      const result = await generateCodeWithLLM({
        prompt,
        systemPrompt,
        files: files || [],
        supabaseConfig,
        injectSupabase,
        provider,
        customEndpoint,
        customApiKey,
        customModel,
        bAiApiKey,
        bAiModel,
      });

      res.json(result);
    } catch (err: any) {
      console.error('AI Generation error:', err);
      res.status(500).json({ error: err.message || 'AI generation failed' });
    }
  });

  // B.AI Models & Agent verification endpoint (https://docs.b.ai/llmservice/api/)
  app.post('/api/ai/b_ai/models', async (req, res) => {
    try {
      const { apiKey } = req.body;
      const models = await fetchBAiModels(apiKey);
      res.json({ success: true, models });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message || 'Failed to fetch B.AI models' });
    }
  });

  // ==========================================
  // 5. Security Token Encryption / Decryption Demo
  // ==========================================

  app.post('/api/security/encrypt-token', (req, res) => {
    try {
      const { plainToken, masterSecret } = req.body;
      if (!plainToken) {
        return res.status(400).json({ error: 'plainToken is required' });
      }

      const encrypted = encryptSecret(plainToken, masterSecret);
      const decryptedVerification = decryptSecret(encrypted, masterSecret);

      res.json({
        ...encrypted,
        decryptedVerification,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/security/decrypt-token', (req, res) => {
    try {
      const { encryptedPayload, masterSecret } = req.body;
      if (!encryptedPayload) {
        return res.status(400).json({ error: 'encryptedPayload is required' });
      }

      const decrypted = decryptSecret(encryptedPayload, masterSecret);
      res.json({ decrypted });
    } catch (err: any) {
      res.status(400).json({ error: `Decryption failed (auth tag mismatch or corrupted): ${err.message}` });
    }
  });

  // ==========================================
  // 6. Vite Development & Production Static Fallback
  // ==========================================

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Web AI Studio server running on port ${PORT}`);
  });
}

startServer();
