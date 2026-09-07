import React, { useState, useEffect } from 'react';
import {
  Cloud,
  Rocket,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Copy,
  Check,
  ShieldCheck,
  RefreshCw,
  Clock,
  Sparkles
} from 'lucide-react';
import { VercelUser, VercelDeployment, VirtualFile } from '../types';

interface VercelHubProps {
  vercelUser: VercelUser | null;
  setVercelUser: (user: VercelUser | null) => void;
  vercelToken: string;
  setVercelToken: (token: string) => void;
  files: VirtualFile[];
  projectName: string;
  lastDeployment: VercelDeployment | null;
  setLastDeployment: (dep: VercelDeployment | null) => void;
}

export const VercelHub: React.FC<VercelHubProps> = ({
  vercelUser,
  setVercelUser,
  vercelToken,
  setVercelToken,
  files,
  projectName,
  lastDeployment,
  setLastDeployment,
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Deploy project name
  const [deployName, setDeployName] = useState(
    projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'ai-web-app'
  );

  useEffect(() => {
    setDeployName(projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-') || 'ai-web-app');
  }, [projectName]);

  // Handle Token Validation
  const handleValidateToken = async () => {
    if (!tokenInput.trim()) return;
    setIsValidating(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/vercel/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'Invalid Vercel API Token');
      }

      setVercelToken(tokenInput.trim());
      setVercelUser(data.user);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsValidating(false);
    }
  };

  // Poll deployment status until READY or ERROR
  const pollStatus = async (deploymentId: string) => {
    setIsPolling(true);
    let attempts = 0;
    const maxAttempts = 30; // 60 seconds approx

    const interval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch('/api/vercel/deployment-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: vercelToken, deploymentId }),
        });
        const data = await res.json();

        if (res.ok && data.id) {
          setLastDeployment({
            id: data.id,
            url: data.url,
            readyState: data.readyState,
            inspectorUrl: data.inspectorUrl,
            createdAt: data.createdAt,
          });

          if (data.readyState === 'READY' || data.readyState === 'ERROR') {
            clearInterval(interval);
            setIsPolling(false);
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setIsPolling(false);
      }
    }, 2000);
  };

  // Trigger Deployment to Vercel
  const handleDeploy = async () => {
    if (!vercelToken) {
      setErrorMessage('Please connect your Vercel account first.');
      return;
    }

    setIsDeploying(true);
    setErrorMessage(null);

    try {
      const payloadFiles = files.map((f) => ({
        path: f.path,
        content: f.content,
      }));

      const res = await fetch('/api/vercel/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: vercelToken,
          projectName: deployName,
          files: payloadFiles,
          target: 'production',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Vercel deployment failed');
      }

      const dep = data.deployment;
      setLastDeployment({
        id: dep.id,
        url: dep.url,
        readyState: dep.readyState,
        inspectorUrl: dep.inspectorUrl,
        createdAt: dep.createdAt,
      });

      // Start polling for production URL
      pollStatus(dep.id);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1115] text-[#E2E8F0] overflow-y-auto p-3 sm:p-4 select-none font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2D3139]">
        <div>
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-white tracking-tight uppercase font-mono">
              Vercel Deployment Pipeline
            </h2>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
            Vercel Deployments API v13 with direct edge DNS provisioning.
          </p>
        </div>

        {vercelUser && (
          <div className="flex items-center gap-2 bg-[#16191E] border border-[#2D3139] px-2.5 py-1 rounded">
            <div className="w-5 h-5 rounded bg-[#1E2227] border border-gray-700 flex items-center justify-center font-bold text-white text-[10px]">
              ▲
            </div>
            <div className="text-left">
              <span className="text-[11px] font-semibold text-white block leading-tight font-mono">
                {vercelUser.username || vercelUser.name || 'Vercel User'}
              </span>
              <span className="text-[9px] text-gray-400">{vercelUser.email}</span>
            </div>
            <button
              onClick={() => {
                setVercelUser(null);
                setVercelToken('');
              }}
              className="text-[10px] text-rose-400 hover:underline ml-1"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="my-2.5 p-2 bg-rose-950/40 border border-rose-900/60 rounded flex items-start gap-2 text-xs text-rose-300 font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 text-[11px]">{errorMessage}</div>
        </div>
      )}

      {/* Not Connected State */}
      {!vercelUser ? (
        <div className="my-4 max-w-md mx-auto w-full bg-[#16191E] border border-[#2D3139] rounded-lg p-5 text-center space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Cloud className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase">Connect Vercel Account</h3>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
              Supply a Vercel personal token for 1-click cloud production deployments.
            </p>
          </div>

          <div className="space-y-2 text-left">
            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">
                VERCEL PERSONAL ACCESS TOKEN
              </label>
              <input
                type="password"
                placeholder="Enter token from vercel.com/account/tokens..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleValidateToken}
              disabled={!tokenInput.trim() || isValidating}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-colors"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Validating credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Connect Vercel API</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-gray-500 text-center font-mono">
              Get token at{' '}
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                vercel.com/account/tokens
              </a>
            </p>
          </div>
        </div>
      ) : (
        /* Connected Workflow */
        <div className="mt-3 space-y-3 max-w-lg">
          {/* Deploy Config Box */}
          <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5 space-y-3 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 font-mono">
              DEPLOY CONFIGURATION
            </h3>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">PROJECT SLUG</label>
              <input
                type="text"
                value={deployName}
                onChange={(e) => setDeployName(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 mb-1">ENVIRONMENT</label>
                <div className="h-7 px-2.5 bg-[#0F1115] border border-[#2D3139] rounded flex items-center text-xs text-gray-300 font-mono">
                  Production (main)
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 mb-1">BUNDLED FILES</label>
                <div className="h-7 px-2.5 bg-[#0F1115] border border-[#2D3139] rounded flex items-center text-xs text-blue-400 font-mono">
                  {files.length} files
                </div>
              </div>
            </div>

            <button
              onClick={handleDeploy}
              disabled={isDeploying || isPolling}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-colors"
            >
              {isDeploying ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Calling Vercel API v13...</span>
                </>
              ) : isPolling ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Building &amp; DNS provisioning...</span>
                </>
              ) : (
                <>
                  <Rocket className="w-3.5 h-3.5" />
                  <span>Deploy to Vercel Now</span>
                </>
              )}
            </button>
          </div>

          {/* Active / Latest Deployment Status Card */}
          {lastDeployment && (
            <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
                  DEPLOYMENT STATUS
                </span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border ${
                    lastDeployment.readyState === 'READY'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : lastDeployment.readyState === 'BUILDING' || lastDeployment.readyState === 'INITIALIZING'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}
                >
                  {lastDeployment.readyState}
                </span>
              </div>

              {lastDeployment.url && (
                <div className="space-y-1.5 pt-2 border-t border-[#2D3139]">
                  <span className="text-[10px] text-gray-400 font-mono block">PRODUCTION URL:</span>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={lastDeployment.url}
                      className="flex-1 bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-emerald-400 font-mono select-all focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopyUrl(lastDeployment.url)}
                      className="p-1 rounded bg-[#1E2227] hover:bg-[#252a32] border border-[#2D3139] text-gray-300 transition-all"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <a
                      href={lastDeployment.url}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {lastDeployment.inspectorUrl && (
                <div className="text-[10px] text-gray-500 pt-1 font-mono">
                  <a
                    href={lastDeployment.inspectorUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>Inspect build logs in Vercel Dashboard</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
