import React, { useState, useEffect } from 'react';
import {
  Github,
  GitBranch,
  GitCommit,
  FolderGit2,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Lock,
  Globe,
  Key
} from 'lucide-react';
import { GitHubUser, GitHubRepo, VirtualFile } from '../types';

interface GitHubHubProps {
  githubUser: GitHubUser | null;
  setGithubUser: (user: GitHubUser | null) => void;
  githubToken: string;
  setGithubToken: (token: string) => void;
  files: VirtualFile[];
  onImportFiles: (newFiles: VirtualFile[], repoName: string) => void;
  currentRepoName: string;
  setCurrentRepoName: (name: string) => void;
}

export const GitHubHub: React.FC<GitHubHubProps> = ({
  githubUser,
  setGithubUser,
  githubToken,
  setGithubToken,
  files,
  onImportFiles,
  currentRepoName,
  setCurrentRepoName,
}) => {
  const [activeTab, setActiveTab] = useState<'import' | 'push' | 'create'>('push');
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [importingRepo, setImportingRepo] = useState<string | null>(null);

  // Push / Commit state
  const [selectedRepo, setSelectedRepo] = useState(currentRepoName || '');
  const [targetBranch, setTargetBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('feat(ai): synchronize generated web components');
  const [isPushing, setIsPushing] = useState(false);
  const [pushResult, setPushResult] = useState<{ commitSha: string; commitUrl: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Create Repo state
  const [newRepoName, setNewRepoName] = useState('my-ai-web-app');
  const [newRepoDesc, setNewRepoDesc] = useState('Generated with Web AI Studio');
  const [isPrivateRepo, setIsPrivateRepo] = useState(false);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);

  // Token input state
  const [patInput, setPatInput] = useState('');
  const [isValidatingToken, setIsValidatingToken] = useState(false);

  // Listen for OAuth popup message
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        if (event.data.token) {
          setGithubToken(event.data.token);
          if (event.data.user) {
            setGithubUser(event.data.user);
          }
          fetchRepos(event.data.token);
        }
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, []);

  const handleOAuthConnect = async () => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/auth/github/url');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to initialize OAuth');
      }

      const popup = window.open(
        data.url,
        'github_oauth_popup',
        'width=600,height=750,menubar=no,toolbar=no'
      );
      if (!popup) {
        setErrorMessage('Popup blocked. Please allow popups for this site or use a Personal Access Token below.');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleValidatePat = async () => {
    if (!patInput.trim()) return;
    setIsValidatingToken(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/github/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: patInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.valid) {
        throw new Error(data.error || 'Invalid GitHub Token');
      }

      setGithubToken(patInput.trim());
      setGithubUser(data.user);
      fetchRepos(patInput.trim());
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsValidatingToken(false);
    }
  };

  const fetchRepos = async (token = githubToken) => {
    if (!token) return;
    setLoadingRepos(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/github/repos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, perPage: 50 }),
      });
      const data = await res.json();
      if (res.ok && data.repos) {
        setRepos(data.repos);
        if (!selectedRepo && data.repos.length > 0) {
          setSelectedRepo(data.repos[0].name);
        }
      } else {
        throw new Error(data.error || 'Could not load repositories');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleImportRepo = async (repo: GitHubRepo) => {
    setImportingRepo(repo.name);
    setErrorMessage(null);
    try {
      const [owner, repoName] = repo.full_name.split('/');
      const res = await fetch('/api/github/repo-tree', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: owner || githubUser?.login,
          repo: repoName || repo.name,
          branch: repo.default_branch || 'main',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch files from repository');

      if (data.files && data.files.length > 0) {
        onImportFiles(data.files, repo.name);
        setSelectedRepo(repo.name);
        setCurrentRepoName(repo.name);
        setActiveTab('push');
      } else {
        throw new Error('No supported code or text files found in the repository main branch.');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setImportingRepo(null);
    }
  };

  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    setIsCreatingRepo(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/github/create-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          name: newRepoName.trim(),
          description: newRepoDesc.trim(),
          isPrivate: isPrivateRepo,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create repository');

      setSelectedRepo(data.repo.name);
      setCurrentRepoName(data.repo.name);
      await fetchRepos();
      setActiveTab('push');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const handlePushToGitHub = async () => {
    if (!selectedRepo || !githubUser) {
      setErrorMessage('Please select a target repository.');
      return;
    }

    setIsPushing(true);
    setErrorMessage(null);
    setPushResult(null);

    try {
      // Package current files
      const payloadFiles = files.map((f) => ({
        path: f.path,
        content: f.content,
      }));

      const res = await fetch('/api/github/commit-and-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: githubToken,
          owner: githubUser.login,
          repo: selectedRepo,
          branch: targetBranch,
          files: payloadFiles,
          commitMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Git commit failed');
      }

      setPushResult({
        commitSha: data.commitSha,
        commitUrl: data.commitUrl,
      });
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPushing(false);
    }
  };

  const filteredRepos = repos.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-[#0F1115] text-[#E2E8F0] overflow-y-auto p-3 sm:p-4 select-none font-sans text-xs">
      {/* Title & Octokit Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2D3139]">
        <div>
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-blue-400" />
            <h2 className="text-xs font-bold text-white tracking-tight uppercase font-mono">
              GitHub Infrastructure Sync
            </h2>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
            Native Octokit pipeline: Blobs → Tree → Commit → Head Ref.
          </p>
        </div>

        {githubUser && (
          <div className="flex items-center gap-2 bg-[#16191E] border border-[#2D3139] px-2.5 py-1 rounded">
            <img
              src={githubUser.avatar_url}
              alt={githubUser.login}
              className="w-5 h-5 rounded-full border border-gray-700"
            />
            <div className="text-left">
              <span className="text-[11px] font-semibold text-white block leading-tight font-mono">
                {githubUser.login}
              </span>
              <span className="text-[9px] text-gray-400">
                {githubUser.public_repos} repos
              </span>
            </div>
            <button
              onClick={() => {
                setGithubUser(null);
                setGithubToken('');
              }}
              className="text-[10px] text-rose-400 hover:underline ml-1"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>

      {/* Error alert banner */}
      {errorMessage && (
        <div className="my-2.5 p-2 bg-rose-950/40 border border-rose-900/60 rounded flex items-start gap-2 text-xs text-rose-300 font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 text-[11px]">{errorMessage}</div>
        </div>
      )}

      {/* If Not Connected: Auth Connection Box */}
      {!githubUser ? (
        <div className="my-4 max-w-md mx-auto w-full bg-[#16191E] border border-[#2D3139] rounded-lg p-5 text-center space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-lg bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mx-auto">
            <Github className="w-5 h-5" />
          </div>

          <div>
            <h3 className="text-xs font-bold text-white font-mono uppercase">Connect GitHub Account</h3>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xs mx-auto">
              OAuth popup or personal access token with <code className="text-blue-400 bg-[#1E2227] px-1 py-0.5 rounded font-mono">repo</code> scope.
            </p>
          </div>

          {/* OAuth Popup button */}
          <button
            onClick={handleOAuthConnect}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Connect with GitHub (Popup)</span>
          </button>

          <div className="flex items-center gap-2 text-gray-600 text-[10px] font-mono">
            <div className="flex-1 h-px bg-[#2D3139]" />
            <span className="uppercase">or access token</span>
            <div className="flex-1 h-px bg-[#2D3139]" />
          </div>

          {/* Alternative: Personal Access Token */}
          <div className="space-y-1.5 text-left">
            <label className="block text-[10px] font-mono text-gray-400">
              Personal Access Token
            </label>
            <div className="flex gap-1.5">
              <input
                type="password"
                placeholder="ghp_..."
                value={patInput}
                onChange={(e) => setPatInput(e.target.value)}
                className="flex-1 bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleValidatePat}
                disabled={!patInput.trim() || isValidatingToken}
                className="px-3 py-1 bg-[#1E2227] hover:bg-[#252a32] border border-[#2D3139] text-white font-medium rounded text-xs disabled:opacity-50 transition-all shrink-0"
              >
                {isValidatingToken ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Connect'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Connected Workflow */
        <div className="mt-3 space-y-3">
          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-[#2D3139] pb-1.5">
            <button
              onClick={() => setActiveTab('push')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'push'
                  ? 'bg-[#1E2227] text-white border border-[#2D3139]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <GitCommit className="w-3 h-3 text-blue-400" />
              <span>Push to Repo</span>
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'import'
                  ? 'bg-[#1E2227] text-white border border-[#2D3139]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-3 h-3 text-blue-400" />
              <span>Import Repo</span>
            </button>

            <button
              onClick={() => setActiveTab('create')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activeTab === 'create'
                  ? 'bg-[#1E2227] text-white border border-[#2D3139]'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Plus className="w-3 h-3 text-blue-400" />
              <span>New Repo</span>
            </button>
          </div>

          {/* TAB 1: PUSH TO GITHUB */}
          {activeTab === 'push' && (
            <div className="space-y-3 max-w-lg">
              <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5 space-y-3 shadow-sm">
                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">
                    DESTINATION REPOSITORY
                  </label>
                  <select
                    value={selectedRepo}
                    onChange={(e) => setSelectedRepo(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  >
                    {repos.length === 0 ? (
                      <option value="">No repositories loaded</option>
                    ) : (
                      repos.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.full_name} {r.private ? '🔒' : '🌐'}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">BRANCH</label>
                    <input
                      type="text"
                      value={targetBranch}
                      onChange={(e) => setTargetBranch(e.target.value)}
                      className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2 py-1 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-gray-400 mb-1">FILES TO SYNC</label>
                    <div className="h-7 px-2.5 bg-[#0F1115] border border-[#2D3139] rounded flex items-center text-xs text-emerald-400 font-mono">
                      {files.length} memory files
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-gray-400 mb-1">COMMIT MESSAGE</label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <button
                  onClick={handlePushToGitHub}
                  disabled={isPushing || !selectedRepo}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-colors"
                >
                  {isPushing ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Writing blobs &amp; updating ref...</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="w-3 h-3" />
                      <span>Commit &amp; Push to {selectedRepo}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Push Result Success card */}
              {pushResult && (
                <div className="p-3 bg-[#16191E] border border-emerald-500/40 rounded-lg flex items-start gap-2.5 text-xs text-emerald-300 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-white block">Commit pushed successfully to GitHub!</span>
                    <p className="text-gray-400 font-mono text-[10px]">
                      Commit SHA: {pushResult.commitSha.slice(0, 7)}
                    </p>
                    <a
                      href={pushResult.commitUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline font-mono text-[11px] mt-0.5"
                    >
                      <span>View commit on GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: IMPORT EXISTING REPO */}
          {activeTab === 'import' && (
            <div className="space-y-2.5">
              <div className="flex items-center gap-1.5">
                <div className="relative flex-1">
                  <Search className="w-3 h-3 text-gray-500 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search repositories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#16191E] border border-[#2D3139] rounded pl-8 pr-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <button
                  onClick={() => fetchRepos()}
                  disabled={loadingRepos}
                  className="p-1.5 rounded bg-[#16191E] hover:bg-[#1E2227] border border-[#2D3139] text-gray-300 transition-all"
                  title="Refresh repos list"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingRepos ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                {filteredRepos.map((repo) => (
                  <div
                    key={repo.id}
                    className="p-2.5 bg-[#16191E] border border-[#2D3139] rounded flex flex-col justify-between gap-2 hover:border-gray-600 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-white truncate font-mono">
                          {repo.name}
                        </span>
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[#1E2227] text-gray-400 border border-[#2D3139] shrink-0 font-mono">
                          {repo.private ? 'Private' : 'Public'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                        {repo.description || 'No description'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1.5 border-t border-[#2D3139] text-[9px] text-gray-500 font-mono">
                      <span>Branch: {repo.default_branch}</span>
                      <button
                        onClick={() => handleImportRepo(repo)}
                        disabled={importingRepo === repo.name}
                        className="px-2 py-0.5 rounded bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-medium text-[10px] flex items-center gap-1 transition-all"
                      >
                        {importingRepo === repo.name ? (
                          <>
                            <Loader2 className="w-2.5 h-2.5 animate-spin" />
                            <span>Cloning...</span>
                          </>
                        ) : (
                          <span>Import</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CREATE NEW REPO */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateRepo} className="max-w-md bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5 space-y-3 shadow-sm">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 mb-1">REPOSITORY NAME</label>
                <input
                  type="text"
                  required
                  value={newRepoName}
                  onChange={(e) => setNewRepoName(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={newRepoDesc}
                  onChange={(e) => setNewRepoDesc(e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-[#0F1115] border border-[#2D3139]">
                <div className="flex items-center gap-2">
                  {isPrivateRepo ? <Lock className="w-3.5 h-3.5 text-amber-400" /> : <Globe className="w-3.5 h-3.5 text-blue-400" />}
                  <div>
                    <span className="text-xs font-medium text-white block">
                      {isPrivateRepo ? 'Private Repository' : 'Public Repository'}
                    </span>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={isPrivateRepo}
                  onChange={(e) => setIsPrivateRepo(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 bg-[#1E2227] border-[#2D3139] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingRepo || !newRepoName.trim()}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm disabled:opacity-50 transition-colors"
              >
                {isCreatingRepo ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Creating on GitHub...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3 h-3" />
                    <span>Create Repository</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
