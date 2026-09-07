import React, { useState, useEffect } from 'react';
import {
  Github,
  PlusCircle,
  RefreshCw,
  ArrowLeft,
  Lock,
  Globe,
  CheckCircle2,
  ExternalLink,
  Key,
  Loader2,
  AlertCircle,
  GitCommit,
  FolderGit2,
  GitBranch,
} from 'lucide-react';
import { GitHubUser, VirtualFile } from '../types';

interface GitHubSyncModalViewProps {
  files: VirtualFile[];
  projectName: string;
  githubUser: GitHubUser | null;
  setGithubUser: (user: GitHubUser | null) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  currentRepoName: string;
  setCurrentRepoName: (name: string) => void;
  onImportFiles?: (files: VirtualFile[], repoName: string) => void;
}

export const GitHubSyncModalView: React.FC<GitHubSyncModalViewProps> = ({
  files,
  projectName,
  githubUser,
  setGithubUser,
  githubToken,
  setGithubToken,
  currentRepoName,
  setCurrentRepoName,
  onImportFiles,
}) => {
  // Step navigation: 'intro' (Screenshot 2) | 'create' (Screenshot 3) | 'synced' (Save / Commit state)
  const [step, setStep] = useState<'intro' | 'create' | 'synced'>(
    currentRepoName ? 'synced' : 'intro'
  );

  // Create repository form state
  const sanitizedDefaultName = (projectName || 'web-ai-studio-app')
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-');
  const [repoNameInput, setRepoNameInput] = useState(sanitizedDefaultName);
  const [repoDescInput, setRepoDescInput] = useState('App created with Google AI Studio');
  const [visibility, setVisibility] = useState<'private' | 'public'>('private');

  // Token input state
  const [tokenInput, setTokenInput] = useState(githubToken || '');
  const [isValidatingToken, setIsValidatingToken] = useState(false);

  // Submitting / Operation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Synced state
  const [commitMessage, setCommitMessage] = useState('Update application from Web AI Studio');
  const [isPushing, setIsPushing] = useState(false);
  const [lastCommitSha, setLastCommitSha] = useState<string | null>(null);
  const [lastCommitUrl, setLastCommitUrl] = useState<string | null>(null);
  const [isPulling, setIsPulling] = useState(false);

  // Listen for OAuth message if user uses OAuth popup
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data.token) {
          setGithubToken(event.data.token);
          setTokenInput(event.data.token);
          try {
            localStorage.setItem('ais_github_token', event.data.token);
          } catch {}
          if (event.data.user) {
            setGithubUser(event.data.user);
            try {
              localStorage.setItem('ais_github_user', JSON.stringify(event.data.user));
            } catch {}
          }
        }
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [setGithubToken, setGithubUser]);

  // Validate GitHub Token (PAT)
  const handleVerifyToken = async () => {
    if (!tokenInput.trim()) return;
    setIsValidatingToken(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/github/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'Token inválido. Asegúrate de que tenga permisos "repo".');
      }

      setGithubToken(tokenInput.trim());
      setGithubUser(data.user);
      try {
        localStorage.setItem('ais_github_token', tokenInput.trim());
        localStorage.setItem('ais_github_user', JSON.stringify(data.user));
      } catch {}
    } catch (err: any) {
      setErrorMessage(err.message || 'Error validando el token de GitHub.');
    } finally {
      setIsValidatingToken(false);
    }
  };

  // OAuth popup flow
  const handleOAuth = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo iniciar OAuth');
      const popup = window.open(
        data.url,
        'github_oauth_popup',
        'width=600,height=750,menubar=no,toolbar=no'
      );
      if (!popup) {
        setErrorMessage('El navegador bloqueó la ventana emergente. Usa tu Personal Access Token (PAT).');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  // Disconnect GitHub
  const handleDisconnect = () => {
    setGithubUser(null);
    setGithubToken('');
    setTokenInput('');
    setCurrentRepoName('');
    try {
      localStorage.removeItem('ais_github_token');
      localStorage.removeItem('ais_github_user');
      localStorage.removeItem('ais_github_current_repo');
    } catch {}
    setStep('intro');
  };

  // Create repository and push initial files (Screenshot 3 Action)
  const handleCreateAndPush = async () => {
    if (!repoNameInput.trim()) {
      setErrorMessage('Por favor introduce un nombre para el repositorio.');
      return;
    }
    const token = githubToken || tokenInput.trim();
    if (!token) {
      setErrorMessage('Debes ingresar tu token de GitHub antes de crear el repositorio.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage('Creando repositorio en GitHub...');

    try {
      // 1. Verify token if user is not loaded
      let currentUser = githubUser;
      if (!currentUser) {
        const valRes = await fetch('/api/github/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token }),
        });
        const valData = await valRes.json();
        if (!valRes.ok || !valData.valid) {
          throw new Error(valData.error || 'Token de GitHub inválido');
        }
        currentUser = valData.user;
        setGithubUser(currentUser);
        setGithubToken(token);
        try {
          localStorage.setItem('ais_github_token', token);
          localStorage.setItem('ais_github_user', JSON.stringify(currentUser));
        } catch {}
      }

      // 2. Create Repository on GitHub
      const createRes = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name: repoNameInput.trim(),
          description: repoDescInput.trim(),
          isPrivate: visibility === 'private',
        }),
      });
      const createData = await createRes.json();
      if (!createRes.ok || !createData.repo) {
        throw new Error(createData.error || 'No se pudo crear el repositorio.');
      }

      const createdRepo = createData.repo;
      setCurrentRepoName(createdRepo.name);
      try {
        localStorage.setItem('ais_github_current_repo', createdRepo.name);
      } catch {}

      // 3. Commit and push current workspace files to GitHub
      setStatusMessage('Subiendo y guardando archivos del proyecto en GitHub...');
      const payloadFiles = files.map((f) => ({
        path: f.path,
        content: f.content,
      }));

      const pushRes = await fetch('/api/github/commit-and-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          owner: currentUser?.login || createdRepo.owner,
          repo: createdRepo.name,
          branch: createdRepo.default_branch || 'main',
          files: payloadFiles,
          commitMessage: 'Initial commit from Google AI Studio',
        }),
      });
      const pushData = await pushRes.json();
      if (pushRes.ok && pushData.commitSha) {
        setLastCommitSha(pushData.commitSha);
        setLastCommitUrl(pushData.commitUrl);
      }

      setStatusMessage('');
      setStep('synced');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error en la sincronización con GitHub.');
    } finally {
      setIsSubmitting(false);
      setStatusMessage('');
    }
  };

  // Push updates to existing connected repository (Save functionality)
  const handleSaveToGitHub = async () => {
    if (!currentRepoName || !githubToken) {
      setErrorMessage('No hay un repositorio seleccionado o token activo.');
      return;
    }

    setIsPushing(true);
    setErrorMessage(null);

    try {
      const payloadFiles = files.map((f) => ({
        path: f.path,
        content: f.content,
      }));

      const res = await fetch('/api/github/commit-and-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: githubUser?.login,
          repo: currentRepoName,
          branch: 'main',
          files: payloadFiles,
          commitMessage: commitMessage.trim() || 'feat: update from Web AI Studio',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al guardar los cambios en GitHub.');
      }

      setLastCommitSha(data.commitSha);
      setLastCommitUrl(data.commitUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error al guardar el commit en GitHub.');
    } finally {
      setIsPushing(false);
    }
  };

  // Pull / Sync files from GitHub repo into workspace
  const handlePullFromGitHub = async () => {
    if (!currentRepoName || !githubToken || !onImportFiles) return;
    setIsPulling(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/github/repo-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: githubUser?.login,
          repo: currentRepoName,
          branch: 'main',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al descargar archivos del repositorio.');
      if (data.files && data.files.length > 0) {
        onImportFiles(data.files, currentRepoName);
      } else {
        throw new Error('No se encontraron archivos en la rama principal.');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPulling(false);
    }
  };

  return (
    <div id="github-sync-container" className="flex flex-col h-full text-gray-200">
      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
          <div className="flex-1 font-mono text-[11px] leading-relaxed">{errorMessage}</div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 1: "Sync to GitHub" (Exact replication of Screenshot 2)
          ========================================================================= */}
      {step === 'intro' && (
        <div id="github-sync-intro" className="flex flex-col items-center justify-center text-center py-4 px-2 sm:px-6">
          <h2 className="text-lg font-medium text-white mb-2">Sync to GitHub</h2>

          {/* Glowing Chromatic Logo Circle */}
          <div className="relative flex items-center justify-center my-6">
            {/* Rainbow blurred glow ring */}
            <div
              className="absolute w-28 h-28 rounded-full blur-xl opacity-70 animate-pulse pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle, rgba(244,63,94,0.7) 0%, rgba(234,179,8,0.7) 25%, rgba(16,185,129,0.7) 50%, rgba(6,182,212,0.7) 75%, rgba(99,102,241,0.7) 100%)',
              }}
            />
            {/* Dark inner circle */}
            <div className="relative w-24 h-24 rounded-full bg-[#181B20] border border-[#2D3139] flex items-center justify-center shadow-2xl">
              <Github className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Two Key Value Propositions */}
          <div className="space-y-4 text-left max-w-sm w-full mx-auto my-4 text-xs text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <PlusCircle className="w-4 h-4 text-[#8AB4F8]" />
              </div>
              <p className="leading-relaxed">A new GitHub repository will be created</p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center shrink-0 mt-0.5">
                <RefreshCw className="w-4 h-4 text-[#8AB4F8]" />
              </div>
              <p className="leading-relaxed">
                Changes from Google AI Studio will be synced to GitHub, and vice versa
              </p>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            id="create-new-repo-btn"
            onClick={() => setStep('create')}
            className="w-full max-w-sm mx-auto mt-6 py-3 px-5 bg-[#1E2228] hover:bg-[#282D36] active:bg-[#323844] text-white font-medium rounded-xl border border-[#333842] transition-all shadow-lg text-sm text-center cursor-pointer"
          >
            Create new repository
          </button>

          {/* If already connected or has active repository, provide shortcut */}
          {currentRepoName && (
            <div className="mt-5 text-center">
              <button
                onClick={() => setStep('synced')}
                className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
              >
                Ver repositorio conectado ({currentRepoName}) y guardar cambios &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SCREEN 2: "Create new repository" Form (Exact replication of Screenshot 3)
          ========================================================================= */}
      {step === 'create' && (
        <div id="github-sync-create" className="flex flex-col space-y-5 animate-in fade-in duration-150">
          {/* Header with Back Arrow */}
          <div className="flex items-center gap-2 pb-2 border-b border-[#2D3139]">
            <button
              onClick={() => setStep('intro')}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2227] transition-colors"
              aria-label="Volver"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-base font-semibold text-white">GitHub sync</h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* 1. Repository Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">New repository name</label>
              <input
                type="text"
                value={repoNameInput}
                onChange={(e) => setRepoNameInput(e.target.value)}
                placeholder="my-ai-app"
                className="w-full bg-[#111317] border border-[#2D3139] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            {/* 2. Repository Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-300">New repository description</label>
              <input
                type="text"
                value={repoDescInput}
                onChange={(e) => setRepoDescInput(e.target.value)}
                placeholder="App created with Google AI Studio"
                className="w-full bg-[#111317] border border-[#2D3139] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* 3. Visibility */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-300">Visibility</label>
              <div className="space-y-2.5">
                {/* Private option */}
                <label
                  onClick={() => setVisibility('private')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    visibility === 'private'
                      ? 'bg-[#1C2027] border-blue-500/60 shadow-sm'
                      : 'bg-[#111317] border-[#2D3139] hover:bg-[#16191E]'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'private'}
                    onChange={() => setVisibility('private')}
                    className="mt-1 text-blue-500 focus:ring-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-gray-400" />
                      <span>Private</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Only you can access this repo on GitHub.com
                    </div>
                  </div>
                </label>

                {/* Public option */}
                <label
                  onClick={() => setVisibility('public')}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    visibility === 'public'
                      ? 'bg-[#1C2027] border-blue-500/60 shadow-sm'
                      : 'bg-[#111317] border-[#2D3139] hover:bg-[#16191E]'
                  }`}
                >
                  <input
                    type="radio"
                    name="visibility"
                    checked={visibility === 'public'}
                    onChange={() => setVisibility('public')}
                    className="mt-1 text-blue-500 focus:ring-0"
                  />
                  <div>
                    <div className="text-sm font-medium text-white flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-gray-400" />
                      <span>Public</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">
                      This repo will be discoverable by everyone on GitHub.com
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. GitHub Connection / Token Status */}
            <div className="pt-2">
              {githubUser ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#111317] border border-[#2D3139]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={githubUser.avatar_url}
                      alt={githubUser.login}
                      className="w-7 h-7 rounded-full border border-gray-700"
                    />
                    <div>
                      <div className="text-xs font-semibold text-white">@{githubUser.login}</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Connected to GitHub</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="text-[11px] text-gray-400 hover:text-rose-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#111317] border border-blue-500/30 space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white flex items-center gap-1.5">
                      <Key className="w-3.5 h-3.5 text-blue-400" />
                      <span>GitHub Personal Access Token</span>
                    </span>
                    <a
                      href="https://github.com/settings/tokens/new?scopes=repo&description=Web+AI+Studio"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <span>Get token</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="password"
                      placeholder="ghp_... (con permisos repo)"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="flex-1 bg-[#1A1D24] border border-[#2D3139] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <button
                      onClick={handleVerifyToken}
                      disabled={!tokenInput.trim() || isValidatingToken}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium disabled:opacity-50 flex items-center gap-1 shrink-0"
                    >
                      {isValidatingToken ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-gray-400">¿Tienes OAuth configurado?</span>
                    <button
                      onClick={handleOAuth}
                      className="text-[11px] text-gray-300 hover:text-white flex items-center gap-1 bg-[#1E2227] px-2.5 py-1 rounded border border-[#2D3139]"
                    >
                      <Github className="w-3 h-3" />
                      <span>Conectar con GitHub</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Create Button matching Screenshot 3 */}
          <div className="pt-3 border-t border-[#2D3139] sticky bottom-0 bg-[#16191E]">
            <button
              id="submit-create-repo-btn"
              onClick={handleCreateAndPush}
              disabled={!repoNameInput.trim() || (!githubToken && !tokenInput.trim()) || isSubmitting}
              className="w-full py-3 bg-[#1E2228] hover:bg-[#282D36] active:bg-[#323844] disabled:opacity-50 text-white font-medium rounded-xl border border-[#333842] transition-all shadow-lg text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span>{statusMessage || 'Creando repositorio en GitHub...'}</span>
                </>
              ) : (
                <span>Create GitHub repository</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          SCREEN 3: "Synced & Save Changes" (The actual saving/pushing mechanism)
          ========================================================================= */}
      {step === 'synced' && (
        <div id="github-sync-synced" className="flex flex-col space-y-4 animate-in fade-in duration-150">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#2D3139]">
            <div className="flex items-center gap-2">
              <Github className="w-4 h-4 text-blue-400" />
              <h2 className="text-base font-semibold text-white">GitHub sync</h2>
            </div>
            <button
              onClick={() => setStep('create')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              + Create another repo
            </button>
          </div>

          {/* Connected Repo Card */}
          <div className="p-4 rounded-xl bg-[#111317] border border-[#2D3139] space-y-3 shadow-inner">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white font-mono">
                    {githubUser ? `${githubUser.login}/` : ''}{currentRepoName}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1E2228] text-gray-300 border border-[#333842]">
                    {visibility}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-400 mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Synced with GitHub</span>
                  <span className="text-gray-500 font-mono">&bull; branch: main</span>
                </div>
              </div>

              {githubUser && (
                <a
                  href={`https://github.com/${githubUser.login}/${currentRepoName}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-[#1A1D24] hover:bg-[#252A32] border border-[#2D3139] text-gray-300 hover:text-white transition-colors"
                  title="Abrir en GitHub"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>

            <div className="text-[11px] text-gray-400 flex items-center justify-between pt-1 border-t border-[#242830]">
              <span>Archivos en seguimiento: <strong className="text-gray-200">{files.length}</strong></span>
              {lastCommitSha && (
                <a
                  href={lastCommitUrl || `https://github.com/${githubUser?.login}/${currentRepoName}/commit/${lastCommitSha}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline font-mono"
                >
                  Commit: {lastCommitSha.substring(0, 7)}
                </a>
              )}
            </div>
          </div>

          {/* Save & Push Changes Panel */}
          <div className="p-4 rounded-xl bg-[#16191E] border border-blue-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-semibold text-white uppercase font-mono">
                  Guardar cambios en GitHub
                </h3>
              </div>
              <span className="text-[10px] text-gray-400">Git Commit &amp; Push</span>
            </div>

            <p className="text-xs text-gray-400 leading-relaxed">
              Guarda y publica directamente los archivos modificados de tu proyecto en el repositorio de GitHub.
            </p>

            <div className="space-y-1.5">
              <label className="text-[11px] text-gray-300 font-medium">Mensaje del commit</label>
              <input
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="feat: cambios realizados desde el editor"
                className="w-full bg-[#111317] border border-[#2D3139] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <button
              id="save-to-github-btn"
              onClick={handleSaveToGitHub}
              disabled={isPushing}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
            >
              {isPushing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Subiendo cambios a GitHub...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Guardar y sincronizar con GitHub</span>
                </>
              )}
            </button>

            {lastCommitSha && (
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center gap-2 text-xs text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="flex-1 font-mono text-[11px]">
                  ¡Cambios guardados con éxito en GitHub!
                </span>
                <a
                  href={lastCommitUrl || `https://github.com/${githubUser?.login}/${currentRepoName}/commit/${lastCommitSha}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs underline text-emerald-400 font-medium"
                >
                  Ver commit
                </a>
              </div>
            )}
          </div>

          {/* Secondary Actions: Pull from GitHub & Disconnect */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePullFromGitHub}
              disabled={isPulling}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-[#1E2227] transition-colors"
            >
              {isPulling ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              <span>Descargar cambios de GitHub</span>
            </button>

            <button
              onClick={handleDisconnect}
              className="text-xs text-rose-400/80 hover:text-rose-300 hover:underline"
            >
              Desconectar repositorio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
