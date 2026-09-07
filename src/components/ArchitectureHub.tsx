import React, { useState } from 'react';
import {
  Layers,
  GitBranch,
  Cloud,
  Database,
  Shield,
  Code2,
  Copy,
  Check,
  Cpu,
  Lock,
  Key,
  Server,
  Terminal,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { SecurityEncryptionResult } from '../types';

export const ArchitectureHub: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'stack' | 'github' | 'vercel' | 'preview' | 'database' | 'security'>('stack');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  // Security interactive demo state
  const [tokenToEncrypt, setTokenToEncrypt] = useState('ghp_9k2LpQw83Zx10Mn94Bv71Tf62Ks08Qa3');
  const [masterSecret, setMasterSecret] = useState('0123456789abcdef0123456789abcdef');
  const [encryptResult, setEncryptResult] = useState<SecurityEncryptionResult | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleTestEncryption = async () => {
    setIsEncrypting(true);
    try {
      const res = await fetch('/api/security/encrypt-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plainToken: tokenToEncrypt,
          masterSecret,
        }),
      });
      const data = await res.json();
      setEncryptResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEncrypting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1115] text-[#E2E8F0] overflow-y-auto p-3 sm:p-4 select-none font-sans text-xs">
      {/* Blueprint Header */}
      <div className="pb-3 border-b border-[#2D3139] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Layers className="w-3.5 h-3.5" />
            </span>
            <h2 className="text-xs font-bold text-white tracking-tight uppercase font-mono">
              Platform Architecture &amp; Tech Lead Specification
            </h2>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
            Production specification for a Bolt.new / Lovable / v0 style autonomous Web AI Platform.
          </p>
        </div>
      </div>

      {/* Navigation Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 border-b border-[#2D3139] scrollbar-none font-mono">
        {[
          { id: 'stack', label: '1. Recommended Stack', icon: Server },
          { id: 'github', label: '2. GitHub Git Data Engine', icon: GitBranch },
          { id: 'vercel', label: '3. Vercel API v13 Pipeline', icon: Cloud },
          { id: 'preview', label: '4. Preview: Iframe vs WebContainers', icon: Cpu },
          { id: 'database', label: '5. Platform Database DDL', icon: Database },
          { id: 'security', label: '6. AES-256-GCM Token Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-[#16191E] text-gray-400 hover:text-white border border-[#2D3139] hover:bg-[#1E2227]'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="py-4 space-y-4 max-w-4xl">
        {/* ========================================== */}
        {/* 1. RECOMMENDED STACK */}
        {/* ========================================== */}
        {activeSection === 'stack' && (
          <div className="space-y-4">
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                <span>Recommended Production Stack Architecture</span>
              </h3>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                To build a high-performance Web AI platform capable of handling real-time code streaming, live previewing, and multi-tenant cloud orchestration, the recommended full-stack architecture is:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1">
                  <div className="text-[10px] font-bold text-blue-400 font-mono uppercase">Frontend &amp; Studio IDE</div>
                  <div className="text-xs font-semibold text-white font-mono">Next.js 15 (App Router) + Tailwind CSS + Monaco Editor</div>
                  <p className="text-[10px] text-gray-400">
                    Provides React Server Components (RSC) for fast initial rendering, Client Components for Monaco editor &amp; split-pane resizing, and Route Handlers for API proxying.
                  </p>
                </div>

                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1">
                  <div className="text-[10px] font-bold text-sky-400 font-mono uppercase">Authentication &amp; User State</div>
                  <div className="text-xs font-semibold text-white font-mono">Supabase Auth (GoTrue) or NextAuth.js v5</div>
                  <p className="text-[10px] text-gray-400">
                    Native GitHub OAuth Provider with offline refresh token persistence, Row-Level Security (RLS) enforcement, and instant session synchronization.
                  </p>
                </div>

                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1">
                  <div className="text-[10px] font-bold text-emerald-400 font-mono uppercase">Database &amp; Persistence</div>
                  <div className="text-xs font-semibold text-white font-mono">PostgreSQL (Supabase) + Drizzle ORM</div>
                  <p className="text-[10px] text-gray-400">
                    Type-safe schema definition, minimal cold-start overhead compared to heavy ORMs, and encrypted secrets storage for user tokens.
                  </p>
                </div>

                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1">
                  <div className="text-[10px] font-bold text-amber-400 font-mono uppercase">AI Code Engine &amp; Streaming</div>
                  <div className="text-xs font-semibold text-white font-mono">Vercel AI SDK Core + Server-Sent Events (SSE)</div>
                  <p className="text-[10px] text-gray-400">
                    Streams structured file artifacts using models with large context windows (DeepSeek-V3, Llama 3.3 70B on Groq, Gemini 2.5 Flash).
                  </p>
                </div>
              </div>
            </div>

            {/* Architecture Diagram Box */}
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 font-mono text-xs text-gray-300">
              <div className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider font-mono">
                END-TO-END REQUEST FLOW
              </div>
              <pre className="text-[10px] leading-relaxed text-blue-300 bg-[#0F1115] p-3 rounded border border-[#2D3139] overflow-x-auto">
{`+------------------+         Prompt + Tree Context         +-------------------------+
|   Browser IDE    | ------------------------------------> |   Next.js API Handler   |
| (Chat + Monaco)  | <------------------------------------ |   (Vercel AI SDK Core)  |
+------------------+           Structured SSE Stream       +-------------------------+
        |                                                              |
        | Push to GitHub                                               | Call LLM Engine
        v                                                              v
+------------------+       Git Data API (Blobs/Trees)      +-------------------------+
|  Octokit Service | ------------------------------------> | DeepSeek / Groq / Gemini|
+------------------+                                       +-------------------------+
        |
        | Deploy to Vercel
        v
+------------------+         Files Manifest API v13        +-------------------------+
|   Vercel API     | ------------------------------------> | Production *.vercel.app |
+------------------+                                       +-------------------------+`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 2. GITHUB GIT DATA ENGINE */}
        {/* ========================================== */}
        {activeSection === 'github' && (
          <div className="space-y-4">
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase">
                  <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GitHub Octokit Atomic Git Data Pipeline</span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `// 1. Create Blobs -> 2. Create Tree -> 3. Create Commit -> 4. Update Ref`,
                      'git-overview'
                    )
                  }
                  className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-white"
                >
                  {copiedSnippet === 'git-overview' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Platforms like Lovable and Bolt do NOT run a local git CLI with shell execution. Instead, they use the <strong>GitHub REST Git Database API</strong> to commit entire file trees atomically in 4 deterministic network requests:
              </p>

              <div className="space-y-2 pt-1 text-xs">
                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139]">
                  <span className="font-bold text-emerald-400 font-mono text-[11px]">Step 1: Create Blobs (`POST /repos/:owner/:repo/git/blobs`)</span>
                  <p className="text-gray-400 mt-0.5 text-[10px]">
                    Each modified file is converted to base64 and uploaded as an immutable Git Blob object. GitHub returns a SHA for each blob.
                  </p>
                </div>

                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139]">
                  <span className="font-bold text-emerald-400 font-mono text-[11px]">Step 2: Create Tree (`POST /repos/:owner/:repo/git/trees`)</span>
                  <p className="text-gray-400 mt-0.5 text-[10px]">
                    We post a tree array referencing the blob SHAs and target file paths, pointing to <code className="text-gray-200">base_tree</code> (the SHA of the current commit's tree) so unaffected files are preserved.
                  </p>
                </div>

                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139]">
                  <span className="font-bold text-emerald-400 font-mono text-[11px]">Step 3: Create Commit (`POST /repos/:owner/:repo/git/commits`)</span>
                  <p className="text-gray-400 mt-0.5 text-[10px]">
                    Creates a commit referencing the new Tree SHA and parent commit SHA.
                  </p>
                </div>

                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139]">
                  <span className="font-bold text-emerald-400 font-mono text-[11px]">Step 4: Update Branch Reference (`PATCH /repos/:owner/:repo/git/refs/heads/:branch`)</span>
                  <p className="text-gray-400 mt-0.5 text-[10px]">
                    Updates <code className="text-gray-200">refs/heads/main</code> to point to the new Commit SHA. This guarantees atomic commits with zero git conflict locks on disk.
                  </p>
                </div>
              </div>
            </div>

            {/* Production Code Snippet */}
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#2D3139]">
                <span className="text-[10px] font-bold text-white font-mono">
                  src/server/githubCommitService.ts
                </span>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `export async function commitFilesToBranch(token, owner, repo, branch, files, message) { ... }`,
                      'git-code'
                    )
                  }
                  className="flex items-center gap-1 text-[10px] font-mono text-blue-400 hover:underline"
                >
                  {copiedSnippet === 'git-code' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>Copy Code</span>
                </button>
              </div>

              <pre className="bg-[#0F1115] p-3 rounded border border-[#2D3139] text-[10px] font-mono text-gray-300 overflow-x-auto mt-2.5 leading-relaxed">
{`import { Octokit } from '@octokit/rest';

export async function commitFilesToBranch(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  files: { path: string; content: string }[],
  message: string
) {
  const octokit = new Octokit({ auth: token });

  // 1. Get HEAD commit and base tree
  const { data: refData } = await octokit.rest.git.getRef({
    owner, repo, ref: \`heads/\${branch}\`
  });
  const parentCommitSha = refData.object.sha;
  const { data: parentCommit } = await octokit.rest.git.getCommit({
    owner, repo, commit_sha: parentCommitSha
  });

  // 2. Upload blobs in parallel
  const treeNodes = await Promise.all(
    files.map(async (file) => {
      const { data: blob } = await octokit.rest.git.createBlob({
        owner, repo,
        content: Buffer.from(file.content).toString('base64'),
        encoding: 'base64'
      });
      return { path: file.path, mode: '100644' as const, type: 'blob' as const, sha: blob.sha };
    })
  );

  // 3. Create tree & commit
  const { data: newTree } = await octokit.rest.git.createTree({
    owner, repo, base_tree: parentCommit.tree.sha, tree: treeNodes
  });

  const { data: newCommit } = await octokit.rest.git.createCommit({
    owner, repo, message, tree: newTree.sha, parents: [parentCommitSha]
  });

  // 4. Update branch ref
  await octokit.rest.git.updateRef({
    owner, repo, ref: \`heads/\${branch}\`, sha: newCommit.sha, force: true
  });

  return { commitSha: newCommit.sha, commitUrl: newCommit.html_url };
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 3. VERCEL DEPLOYMENTS API */}
        {/* ========================================== */}
        {activeSection === 'vercel' && (
          <div className="space-y-4">
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase">
                <Cloud className="w-3.5 h-3.5 text-blue-400" />
                <span>Vercel Deployments API v13 Architecture</span>
              </h3>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                There are two architectural methods for deploying to Vercel:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1.5">
                  <span className="text-[10px] font-bold text-blue-400 font-mono uppercase">Method A: Direct Files Payload (Instant)</span>
                  <p className="text-[10px] text-gray-400">
                    Sends the in-memory files manifest directly to <code className="text-gray-200">POST https://api.vercel.com/v13/deployments</code>. Vercel spins up an isolated build container and assigns a live URL in seconds without requiring git webhooks or repository access.
                  </p>
                </div>

                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1.5">
                  <span className="text-[10px] font-bold text-sky-400 font-mono uppercase">Method B: Git-Connected Webhook</span>
                  <p className="text-[10px] text-gray-400">
                    When the user pushes to GitHub via Octokit, Vercel's GitHub app receives a webhook on <code className="text-gray-200">push</code> event and kicks off an automated build. Production domains remain permanently bound to the <code className="text-gray-200">main</code> branch.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5">
              <div className="text-[10px] font-bold text-white font-mono mb-2">
                VERCEL DIRECT DEPLOYMENT REQUEST PAYLOAD
              </div>
              <pre className="bg-[#0F1115] p-3 rounded border border-[#2D3139] text-[10px] font-mono text-gray-300 overflow-x-auto leading-relaxed">
{`POST https://api.vercel.com/v13/deployments
Authorization: Bearer <USER_VERCEL_TOKEN>
Content-Type: application/json

{
  "name": "ai-generated-saas",
  "target": "production",
  "projectSettings": { "framework": null },
  "files": [
    { "file": "index.html", "data": "<!DOCTYPE html>...", "encoding": "utf-8" },
    { "file": "src/main.js", "data": "console.log('boot');", "encoding": "utf-8" },
    { "file": "package.json", "data": "{\\"dependencies\\":{}}", "encoding": "utf-8" }
  ]
}`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 4. PREVIEW ENGINES */}
        {/* ========================================== */}
        {activeSection === 'preview' && (
          <div className="space-y-4">
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                <span>Live Preview: Iframe vs Sandpack vs WebContainers</span>
              </h3>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Choosing the right preview engine is the most critical UX decision in web AI studio architecture:
              </p>

              <div className="space-y-3 pt-1">
                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-400 text-xs font-mono">1. Sandboxed Iframe with In-Memory Bundler (Used Here)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">Universal &amp; Fast</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Compiles HTML, CSS, and ES Modules into an in-memory string and renders via <code className="text-gray-200">&lt;iframe srcdoc="..." sandbox="allow-scripts"&gt;</code>.
                    <strong> Pros:</strong> Loads in under 5ms, zero server costs, works in any browser and iframe environment.
                    <strong> Cons:</strong> Cannot run native Node.js backend processes (e.g. raw express servers or native C++ addons).
                  </p>
                </div>

                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-400 text-xs font-mono">2. WebContainers (StackBlitz / Bolt.new)</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/30 font-mono">Full Node.js in Browser</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Runs a full Node.js WebAssembly operating system inside the browser.
                    <strong> Pros:</strong> Can run <code className="text-gray-200">npm install</code>, Next.js dev server, Vite dev server directly in the user's browser.
                    <strong> Cons:</strong> Requires Cross-Origin Isolation headers (<code className="text-gray-200">COOP/COEP</code>), high memory consumption on low-end mobile devices, and browser compatibility limits.
                  </p>
                </div>

                <div className="p-3 bg-[#0F1115] border border-[#2D3139] rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-400 text-xs font-mono">3. CodeSandbox Sandpack</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">Client Bundler</span>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Client-side package bundler that resolves dependencies via npm CDN unpkg/esm.sh.
                    <strong> Pros:</strong> Great component ecosystem, automatic React/Vue compilation.
                    <strong> Cons:</strong> Slower cold start, dependent on external CDN availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 5. DATABASE DDL */}
        {/* ========================================== */}
        {activeSection === 'database' && (
          <div className="space-y-4">
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Platform Production PostgreSQL Schema</span>
                </h3>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `-- Production Schema for Web AI Studio Platform ...`,
                      'db-schema'
                    )
                  }
                  className="flex items-center gap-1 text-[10px] font-mono text-gray-400 hover:text-white"
                >
                  {copiedSnippet === 'db-schema' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>Copy SQL DDL</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Relational schema with encrypted secrets storage, foreign keys, row-level security, and audit logs:
              </p>

              <pre className="bg-[#0F1115] p-3 rounded text-[10px] font-mono text-emerald-400/90 overflow-x-auto leading-relaxed border border-[#2D3139]">
{`-- 1. Users Table (Linked to Supabase Auth or NextAuth)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Encrypted User Integration Credentials (AES-256-GCM)
CREATE TABLE public.encrypted_user_secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- 'github', 'vercel', 'supabase'
  iv_hex TEXT NOT NULL,
  auth_tag_hex TEXT NOT NULL,
  salt_hex TEXT NOT NULL,
  ciphertext_hex TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, provider)
);

-- 3. Projects Table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  github_repo_full_name TEXT,
  github_default_branch TEXT DEFAULT 'main',
  vercel_project_id TEXT,
  vercel_production_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Project Virtual Files Table (Snapshots)
CREATE TABLE public.project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  file_path TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(project_id, file_path)
);

-- 5. Deployments Log Table
CREATE TABLE public.deployments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  provider TEXT NOT NULL, -- 'vercel', 'netlify'
  deployment_url TEXT,
  status TEXT DEFAULT 'INITIALIZING', -- 'BUILDING', 'READY', 'ERROR'
  commit_sha TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on all platform tables
ALTER TABLE public.encrypted_user_secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only access their own secrets"
  ON public.encrypted_user_secrets FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own projects"
  ON public.projects FOR ALL USING (auth.uid() = user_id);`}
              </pre>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* 6. SECURITY & ENCRYPTION ENGINE */}
        {/* ========================================== */}
        {activeSection === 'security' && (
          <div className="space-y-4">
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2 font-mono uppercase">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust Token Encryption Pipeline (AES-256-GCM + PBKDF2)</span>
              </h3>
              <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                Storing third-party access tokens (GitHub with <code className="text-gray-200">repo</code> write scope, Vercel personal tokens) requires stringent security. Never store plaintext tokens.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139] space-y-1">
                  <span className="font-bold text-emerald-400 font-mono text-[10px] uppercase">1. Envelope Encryption</span>
                  <p className="text-[10px] text-gray-400">
                    Use a master Key Encryption Key (KEK) from KMS, combined with random per-token data keys.
                  </p>
                </div>

                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139] space-y-1">
                  <span className="font-bold text-sky-400 font-mono text-[10px] uppercase">2. Authenticated GCM</span>
                  <p className="text-[10px] text-gray-400">
                    AES-GCM computes a 128-bit MAC tag. Tampering with even 1 bit causes decryption to fail.
                  </p>
                </div>

                <div className="p-2.5 bg-[#0F1115] rounded border border-[#2D3139] space-y-1">
                  <span className="font-bold text-blue-400 font-mono text-[10px] uppercase">3. Server-Side Scoping</span>
                  <p className="text-[10px] text-gray-400">
                    Plaintext tokens are decrypted strictly in ephemeral memory within backend route handlers.
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Live Encryption Tester */}
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 font-mono">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span>Live AES-256-GCM Encryption Engine Tester</span>
                </span>
                <span className="text-[9px] text-gray-400 font-mono">Real backend crypto module</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">
                    PLAINTEXT USER TOKEN
                  </label>
                  <input
                    type="text"
                    value={tokenToEncrypt}
                    onChange={(e) => setTokenToEncrypt(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">
                    MASTER KEY SECRET (32 hex characters)
                  </label>
                  <input
                    type="text"
                    value={masterSecret}
                    onChange={(e) => setMasterSecret(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  onClick={handleTestEncryption}
                  disabled={isEncrypting || !tokenToEncrypt}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded shadow-sm transition-colors font-mono"
                >
                  {isEncrypting ? 'Encrypting & Verifying...' : 'Execute AES-256-GCM Test'}
                </button>
              </div>

              {encryptResult && (
                <div className="mt-3 p-3 bg-[#0F1115] rounded border border-[#2D3139] space-y-1.5 text-xs font-mono">
                  <div className="text-emerald-400 font-bold text-[10px] flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Cryptographic Operation Successful:</span>
                  </div>
                  <div className="space-y-1 text-[10px] text-gray-300">
                    <div>
                      <span className="text-gray-500">Algorithm: </span>
                      <span className="text-blue-400">{encryptResult.algorithm}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-500">IV (12 bytes hex): </span>
                      <span className="text-sky-300">{encryptResult.ivHex}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-500">Auth Tag (16 bytes hex): </span>
                      <span className="text-amber-300">{encryptResult.authTagHex}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-500">Ciphertext: </span>
                      <span className="text-emerald-300">{encryptResult.ciphertextHex}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Decrypted Verification: </span>
                      <span className="text-white font-bold">{encryptResult.decryptedVerification}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
