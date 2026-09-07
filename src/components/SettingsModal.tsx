import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  Sparkles,
  Settings,
  Github,
  Cloud,
  Database,
  Key,
  History,
  Share2,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Mic,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { LLMConfig, GitHubUser, VercelUser, SupabaseConfig, VirtualFile } from '../types';
import { GitHubSyncModalView } from './GitHubSyncModalView';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'chat' | 'share' | 'publish' | 'versions' | 'github' | 'integrations' | 'secrets';
  llmConfig: LLMConfig;
  setLlmConfig: React.Dispatch<React.SetStateAction<LLMConfig>>;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
  githubUser: GitHubUser | null;
  setGithubUser?: (user: GitHubUser | null) => void;
  githubToken?: string;
  setGithubToken?: (token: string) => void;
  currentRepoName?: string;
  setCurrentRepoName?: (name: string) => void;
  onImportFiles?: (files: VirtualFile[], repoName: string) => void;
  projectName?: string;
  vercelUser: VercelUser | null;
  supabaseConfig: SupabaseConfig;
  setSupabaseConfig: React.Dispatch<React.SetStateAction<SupabaseConfig>>;
  onOpenPushModal: () => void;
  onOpenDeployModal: () => void;
  files: VirtualFile[];
  onRestoreCheckpoint?: (files: VirtualFile[]) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'chat',
  llmConfig,
  setLlmConfig,
  systemPrompt,
  setSystemPrompt,
  githubUser,
  setGithubUser = () => {},
  githubToken = '',
  setGithubToken = () => {},
  currentRepoName = '',
  setCurrentRepoName = () => {},
  onImportFiles,
  projectName = 'cloudpulse-saas',
  vercelUser,
  supabaseConfig,
  setSupabaseConfig,
  onOpenPushModal,
  onOpenDeployModal,
  files,
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'share' | 'publish' | 'versions' | 'github' | 'integrations' | 'secrets'>(initialTab);
  const [editingSystemPrompt, setEditingSystemPrompt] = useState(false);
  const [customPromptText, setCustomPromptText] = useState(systemPrompt);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // B.AI verification state
  const [verifyingBAi, setVerifyingBAi] = useState(false);
  const [bAiStatus, setBAiStatus] = useState<string | null>(null);
  const [bAiModelList, setBAiModelList] = useState<string[]>([]);

  const handleVerifyBAi = async () => {
    setVerifyingBAi(true);
    setBAiStatus(null);
    try {
      const res = await fetch('/api/ai/b_ai/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: llmConfig.bAiApiKey }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models)) {
        const ids = data.models.map((m: any) => m.id || m.name || String(m));
        setBAiModelList(ids);
        setBAiStatus(`Connected successfully! Retrieved ${ids.length} models/agents.`);
      } else {
        setBAiStatus(data.error || 'Connection failed. Please check your API key.');
      }
    } catch (err: any) {
      setBAiStatus(`Error conectando con el motor de IA: ${err.message}`);
    } finally {
      setVerifyingBAi(false);
    }
  };

  if (!isOpen) return null;

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleSaveSystemPrompt = () => {
    setSystemPrompt(customPromptText);
    setEditingSystemPrompt(false);
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="settings-modal-container"
        className="bg-[#16191E] border-t sm:border border-[#2D3139] sm:rounded-2xl w-full max-w-xl max-h-[85vh] sm:max-h-[80vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Horizontally Scrollable Tabs + Close Button */}
        <div className="flex items-center justify-between border-b border-[#2D3139] bg-[#0F1115] px-3 shrink-0">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 scroll-hide text-xs">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              <span>Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('share')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'share'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Share
            </button>

            <button
              onClick={() => setActiveTab('publish')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'publish'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Publish
            </button>

            <button
              onClick={() => setActiveTab('versions')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'versions'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Versions
            </button>

            <button
              onClick={() => setActiveTab('github')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'github'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {activeTab === 'github' && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />
              )}
              <span>GitHub</span>
            </button>

            <button
              onClick={() => setActiveTab('integrations')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'integrations'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Integrations
            </button>

            <button
              onClick={() => setActiveTab('secrets')}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all ${
                activeTab === 'secrets'
                  ? 'bg-[#252A32] text-white border border-[#3B404D]'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Secrets
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2227] shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-sm">
          {/* 1. CHAT SETTINGS (Screenshots 2 & 3 exact replication) */}
          {activeTab === 'chat' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">Chat settings</h2>

              {/* Model Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">
                  Select model to use in Chat
                </label>
                <select
                  value={llmConfig.provider}
                  onChange={(e) =>
                    setLlmConfig({
                      ...llmConfig,
                      provider: e.target.value as any,
                      modelName:
                        e.target.value === 'gemini'
                          ? 'Gemini 3.8 Flash'
                          : e.target.value === 'b_ai'
                          ? (llmConfig.bAiModel || 'deepseek-v4-flash')
                          : e.target.value === 'groq'
                          ? 'Groq (Llama 3.3 70B)'
                          : e.target.value === 'deepseek'
                          ? 'DeepSeek Coder-V3'
                          : 'Custom LLM',
                    })
                  }
                  className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 text-sm"
                >
                  <option value="gemini">Default (Gemini 3.8 Flash)</option>
                  <option value="b_ai">Motor Autónomo de IA (Modo Auto / Multi-modelo)</option>
                  <option value="groq">Groq (Llama 3.3 70B Fast)</option>
                  <option value="deepseek">DeepSeek Coder-V3</option>
                  <option value="custom">Custom OpenAI-compatible API</option>
                </select>
              </div>

              {/* Dedicated Configuration Panel */}
              {llmConfig.provider === 'b_ai' && (
                <div className="p-4 rounded-xl bg-[#12161F] border border-blue-500/30 space-y-3.5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span className="text-xs font-semibold text-white">Configuración del Motor Inteligente</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-gray-300 font-medium">Clave de API Personal / BYOK (Opcional)</label>
                      {llmConfig.bAiApiKey && (
                        <button
                          type="button"
                          onClick={() => {
                            setLlmConfig({ ...llmConfig, bAiApiKey: '' });
                            setBAiStatus(null);
                          }}
                          className="text-[10px] text-amber-400 hover:underline"
                        >
                          Restablecer a Clave Incluida
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-400">
                      Si pagas por tu propio plan o tienes créditos privados, ingresa tu clave aquí. Si la dejas vacía, se usará la incluida en la plataforma.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="sk-... (Opcional, o deja vacío para usar la incluida)"
                        value={llmConfig.bAiApiKey || ''}
                        onChange={(e) =>
                          setLlmConfig({
                            ...llmConfig,
                            bAiApiKey: e.target.value,
                          })
                        }
                        className="flex-1 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={handleVerifyBAi}
                        disabled={verifyingBAi}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-all shrink-0"
                      >
                        {verifyingBAi ? 'Verificando...' : 'Probar Clave'}
                      </button>
                    </div>
                    {bAiStatus && (
                      <p
                        className={`text-[11px] font-mono mt-1 ${
                          bAiStatus.startsWith('Connected') ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {bAiStatus}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-300 font-medium">Modelo / Modo de IA</label>
                    <select
                      value={llmConfig.bAiModel || 'auto'}
                      onChange={(e) =>
                        setLlmConfig({
                          ...llmConfig,
                          bAiModel: e.target.value,
                          modelName: e.target.value === 'auto' ? 'Modo Auto' : e.target.value,
                        })
                      }
                      className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    >
                      <option value="auto">Modo Auto (Recomendado - Enrutador Inteligente)</option>
                      <option value="deepseek-v4-flash">deepseek-v4-flash (Frontier Ultra-Fast)</option>
                      <option value="glm-5.3-flash">glm-5.3-flash (1M Context Coding)</option>
                      <option value="qwen3.8-flash">qwen3.8-flash (High Speed)</option>
                      <option value="gpt-5-mini">gpt-5-mini (Daily Assistant)</option>
                      {bAiModelList.length > 0 &&
                        bAiModelList
                          .filter(
                            (id) =>
                              !['deepseek-v4-flash', 'glm-5.3-flash', 'qwen3.8-flash', 'gpt-5-mini'].includes(id)
                          )
                          .map((id) => (
                            <option key={id} value={id}>
                              {id}
                            </option>
                          ))}
                      <option value="custom">-- Agente / Modelo Personalizado --</option>
                    </select>

                    {llmConfig.bAiModel === 'custom' && (
                      <input
                        type="text"
                        placeholder="Ingresa el nombre o ID del modelo"
                        onChange={(e) =>
                          setLlmConfig({
                            ...llmConfig,
                            bAiModel: e.target.value,
                            modelName: e.target.value,
                          })
                        }
                        className="w-full mt-1.5 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* System instructions / Custom instructions Card */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-300 font-medium">System instructions</span>
                {!editingSystemPrompt ? (
                  <div
                    onClick={() => setEditingSystemPrompt(true)}
                    className="p-3.5 rounded-xl bg-[#1A1D24] border border-[#2D3139] hover:border-[#3D4452] cursor-pointer transition-all space-y-1 group"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>Custom instructions</span>
                      <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {systemPrompt || 'No custom system instructions specified.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 p-3 rounded-xl bg-[#1A1D24] border border-blue-500/40">
                    <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
                      <span>Edit custom instructions</span>
                    </div>
                    <textarea
                      value={customPromptText}
                      onChange={(e) => setCustomPromptText(e.target.value)}
                      rows={4}
                      className="w-full bg-[#0F1115] border border-[#2D3139] rounded-lg p-2 text-xs text-white resize-none focus:outline-none focus:border-blue-500 font-mono"
                      placeholder="Specify developer guidelines, tech stack constraints, or user preferences..."
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setCustomPromptText(systemPrompt);
                          setEditingSystemPrompt(false);
                        }}
                        className="px-3 py-1 rounded text-xs text-gray-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveSystemPrompt}
                        className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                      >
                        Save instructions
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Usage Pro Card (Colorful gradient border) */}
              <div className="space-y-1.5">
                <span className="text-xs text-gray-300 font-medium">Usage</span>
                <div className="p-[1.5px] rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-400 shadow-md">
                  <div className="bg-[#16191E] rounded-[10px] p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="px-1.5 py-0.5 bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded text-[10px] font-bold tracking-wider mt-0.5">
                        PRO
                      </span>
                      <p className="text-xs text-gray-300 leading-snug">
                        You're currently using your Google AI subscription for requests in chat.
                      </p>
                    </div>
                    <Settings className="w-4 h-4 text-gray-400 shrink-0" />
                  </div>
                </div>
              </div>

              {/* Microphone source */}
              <div className="space-y-1.5">
                <label className="text-xs text-gray-300 font-medium">Microphone source</label>
                <div className="relative">
                  <select className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 text-sm appearance-none">
                    <option value="default">Predeterminado (Microphone Built-in)</option>
                    <option value="external">External Audio Interface</option>
                  </select>
                  <Mic className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          )}

          {/* 2. SHARE */}
          {activeTab === 'share' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">Share Project</h2>
              <p className="text-xs text-gray-400">
                Anyone with the link can view and inspect your generated web application live in their browser.
              </p>
              <div className="flex items-center gap-2 bg-[#1A1D24] border border-[#2D3139] p-2.5 rounded-xl">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="bg-transparent text-xs text-gray-300 flex-1 outline-none font-mono"
                />
                <button
                  onClick={handleCopyShareLink}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. PUBLISH (Vercel) */}
          {activeTab === 'publish' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">Publish to Production</h2>
              <p className="text-xs text-gray-400">
                Deploy your live web application directly to Vercel's global edge infrastructure.
              </p>
              <div className="p-4 rounded-xl bg-[#1A1D24] border border-[#2D3139] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    <span className="font-medium text-white text-sm">Vercel Edge Platform</span>
                  </div>
                  {vercelUser ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Ready to deploy</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenDeployModal();
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <Cloud className="w-4 h-4" />
                  <span>Open Vercel Deployment Hub</span>
                </button>
              </div>
            </div>
          )}

          {/* 4. VERSIONS / CHECKPOINTS */}
          {activeTab === 'versions' && (
            <div className="space-y-3">
              <h2 className="text-base font-semibold text-white">Version History &amp; Checkpoints</h2>
              <p className="text-xs text-gray-400">
                Every AI prompt creates a discrete project snapshot. You can restore any previous checkpoint anytime.
              </p>
              <div className="p-3.5 rounded-xl bg-[#1A1D24] border border-[#2D3139] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-300 font-medium">Active Version Snapshot</span>
                  <span className="text-blue-400 font-mono">{files.length} files</span>
                </div>
                <div className="text-[11px] text-gray-500 font-mono">
                  Changes auto-saved to virtual runtime
                </div>
              </div>
            </div>
          )}

          {/* 5. GITHUB SYNC & SAVE (Screenshots 2 & 3) */}
          {activeTab === 'github' && (
            <GitHubSyncModalView
              files={files}
              projectName={projectName}
              githubUser={githubUser}
              setGithubUser={setGithubUser}
              githubToken={githubToken}
              setGithubToken={setGithubToken}
              currentRepoName={currentRepoName}
              setCurrentRepoName={setCurrentRepoName}
              onImportFiles={onImportFiles}
            />
          )}

          {/* 6. INTEGRATIONS (Supabase) */}
          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">Supabase Integration</h2>
              <p className="text-xs text-gray-400">
                Connect your real Supabase project URL and anon public key for live Postgres database &amp; Auth.
              </p>
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Project URL</label>
                <input
                  type="text"
                  placeholder="https://xyzcompany.supabase.co"
                  value={supabaseConfig.url}
                  onChange={(e) =>
                    setSupabaseConfig({
                      ...supabaseConfig,
                      url: e.target.value,
                      isConnected: !!(e.target.value && supabaseConfig.anonKey),
                    })
                  }
                  className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-300">Anon Public Key</label>
                <input
                  type="password"
                  placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                  value={supabaseConfig.anonKey}
                  onChange={(e) =>
                    setSupabaseConfig({
                      ...supabaseConfig,
                      anonKey: e.target.value,
                      isConnected: !!(supabaseConfig.url && e.target.value),
                    })
                  }
                  className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}

          {/* 7. SECRETS */}
          {activeTab === 'secrets' && (
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-white">API Keys &amp; Secrets</h2>
              <p className="text-xs text-gray-400">
                Configure external LLM keys or custom endpoints.
              </p>

              {/* Service Key */}
              <div className="space-y-2 p-3.5 rounded-xl bg-[#12161F] border border-[#2D3139]">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-gray-200 font-medium">Clave de API Personal (BYOK) o Clave del Motor</label>
                  <span className="text-[10px] text-blue-400 font-mono">BYOK Soportado</span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Si tienes una suscripción de pago o créditos de API propios, ingresa aquí tu clave. De lo contrario, se usará la clave incluida en el servidor.
                </p>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="sk-... o Clave de API personal"
                    value={llmConfig.bAiApiKey || ''}
                    onChange={(e) => setLlmConfig({ ...llmConfig, bAiApiKey: e.target.value })}
                    className="flex-1 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleVerifyBAi}
                    disabled={verifyingBAi}
                    className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-all shrink-0"
                  >
                    {verifyingBAi ? 'Probando...' : 'Probar Clave'}
                  </button>
                </div>
                {bAiStatus && (
                  <p
                    className={`text-[11px] font-mono mt-1 ${
                      bAiStatus.startsWith('Connected') ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    {bAiStatus}
                  </p>
                )}
                <p className="text-[11px] text-gray-500">
                  Unifies agent calls across DeepSeek-V4, GLM-5.3, Qwen 3.8, GPT-5 and custom agents.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300">Custom LLM Key (Bearer token)</label>
                <input
                  type="password"
                  placeholder="sk-..."
                  value={llmConfig.customApiKey || ''}
                  onChange={(e) => setLlmConfig({ ...llmConfig, customApiKey: e.target.value })}
                  className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
