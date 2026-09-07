import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowUp,
  Sparkles,
  SlidersHorizontal,
  Bot,
  User,
  CheckCircle2,
  FileCode,
  Loader2,
  AlertCircle,
  Plus,
  Mic,
  MicOff,
  Flag,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  GitCompare,
  X,
  Upload,
  Camera,
  ChevronDown,
  Key,
  FileText,
  ExternalLink,
  Cpu
} from 'lucide-react';
import { ChatMessage, LLMConfig, SupabaseConfig, VirtualFile, ChatAttachment, ChatSession } from '../types';
import { ChangesModal } from './ChangesModal';
import { AgentSelectorModal } from './AgentSelectorModal';
import { AgentLogo } from './AgentIcons';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (prompt: string, attachments?: ChatAttachment[]) => Promise<void>;
  isGenerating: boolean;
  llmConfig: LLMConfig;
  setLlmConfig: React.Dispatch<React.SetStateAction<LLMConfig>>;
  injectSupabase: boolean;
  setInjectSupabase: (inject: boolean) => void;
  supabaseConfig: SupabaseConfig;
  onSelectFile: (path: string) => void;
  onNewChat?: () => void;
  chatSessions?: ChatSession[];
  onSelectSession?: (session: ChatSession) => void;
  onRestoreCheckpoint?: (files: VirtualFile[]) => void;
  allFiles?: VirtualFile[];
  onOpenSettingsModal?: () => void;
  executionSeconds?: number;
}

// Crisp Google Drive SVG Icon
const GoogleDriveIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 87.3 78" fill="none">
    <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
    <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44c-.8 1.4-1.2 2.95-1.2 4.5h27.5z" fill="#00ac47"/>
    <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.1z" fill="#ea4335"/>
    <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2z" fill="#00832d"/>
    <path d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2z" fill="#2684fc"/>
    <path d="M73.4 26.5 60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
  </svg>
);

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  isGenerating,
  llmConfig,
  setLlmConfig,
  injectSupabase,
  setInjectSupabase,
  supabaseConfig,
  onSelectFile,
  onNewChat,
  chatSessions = [],
  onSelectSession,
  onRestoreCheckpoint,
  allFiles = [],
  onOpenSettingsModal,
  executionSeconds = 4,
}) => {
  const [inputPrompt, setInputPrompt] = useState('');
  const [attachments, setAttachments] = useState<ChatAttachment[]>([]);
  
  // Floating menus
  const [showBottomPlusMenu, setShowBottomPlusMenu] = useState(false);
  const [showTopPlusMenu, setShowTopPlusMenu] = useState(false);
  const [isAgentSelectorOpen, setIsAgentSelectorOpen] = useState(false);
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveUrlInput, setDriveUrlInput] = useState('');

  const [isListening, setIsListening] = useState(false);
  const [diffModalData, setDiffModalData] = useState<{
    filesModified: string[];
    previousFiles?: VirtualFile[];
    checkpointFiles?: VirtualFile[];
  } | null>(null);
  const [messageFeedback, setMessageFeedback] = useState<Record<string, 'like' | 'dislike' | null>>({});
  const [savedCheckpoints, setSavedCheckpoints] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const bottomMenuRef = useRef<HTMLDivElement>(null);
  const topMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  // Click outside listener to close floating menus
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bottomMenuRef.current && !bottomMenuRef.current.contains(e.target as Node)) {
        setShowBottomPlusMenu(false);
      }
      if (topMenuRef.current && !topMenuRef.current.contains(e.target as Node)) {
        setShowTopPlusMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isCamera = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      const isImage = file.type.startsWith('image/');
      if (isImage) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAttachments((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              type: 'image',
              dataUrl: event.target?.result as string,
              size: file.size,
            },
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            name: file.name,
            type: 'file',
            size: file.size,
          },
        ]);
      }
    });

    e.target.value = '';
    setShowBottomPlusMenu(false);
  };

  // Google Drive attach handler
  const handleAttachDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveUrlInput.trim()) return;

    let docName = 'Google Drive File';
    try {
      const url = new URL(driveUrlInput.trim());
      const pathSegments = url.pathname.split('/').filter(Boolean);
      if (pathSegments.length > 0) {
        docName = pathSegments[pathSegments.length - 1] || 'Google Drive File';
      }
    } catch {
      docName = driveUrlInput.trim().slice(0, 24);
    }

    setAttachments((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        name: docName,
        type: 'drive',
        dataUrl: driveUrlInput.trim(),
      },
    ]);

    setDriveUrlInput('');
    setIsDriveModalOpen(false);
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Speech to Text support
  const handleToggleMic = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('El reconocimiento por voz no está soportado en este navegador.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputPrompt((prev) => (prev ? prev + ' ' + transcript : transcript));
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!inputPrompt.trim() && attachments.length === 0) || isGenerating) return;

    let text = inputPrompt.trim();
    if (attachments.length > 0) {
      const attachInfo = attachments
        .map((a) => `[Adjunto: ${a.name} (${a.type})]`)
        .join(' ');
      text = text ? `${text}\n\n${attachInfo}` : attachInfo;
    }

    const currentAttachments = [...attachments];
    setInputPrompt('');
    setAttachments([]);
    setShowBottomPlusMenu(false);

    await onSendMessage(text, currentAttachments);
  };

  const handleFeedback = (msgId: string, type: 'like' | 'dislike') => {
    setMessageFeedback((prev) => ({
      ...prev,
      [msgId]: prev[msgId] === type ? null : type,
    }));
  };

  const handleSaveCheckpoint = (msgId: string) => {
    setSavedCheckpoints((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div id="chat-panel" className="flex flex-col h-full bg-[#16191E] select-none font-sans text-xs relative">
      {/* 1. Header (AI Studio style: Sparkle + Title + Settings + Plus Menu) */}
      <div className="h-12 border-b border-[#242830] px-3.5 flex items-center justify-between shrink-0 bg-[#16191E] relative">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3.5 h-3.5 fill-blue-400" />
          </div>
          <span className="font-medium text-sm text-gray-200 tracking-tight">
            Web AI Studio
          </span>
        </div>

        <div className="flex items-center gap-1.5 relative">
          {onOpenSettingsModal && (
            <button
              onClick={onOpenSettingsModal}
              className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2227] transition-all"
              title="Ajustes y Parámetros"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}

          {/* Top Right (+) Button: Opens "Start new chat" + Chat History (Screenshot 2) */}
          <div className="relative" ref={topMenuRef}>
            <button
              onClick={() => setShowTopPlusMenu(!showTopPlusMenu)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                showTopPlusMenu
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white hover:bg-[#1E2227]'
              }`}
              title="Nuevo chat o Historial"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Top Right Menu (Screenshot 2) */}
            {showTopPlusMenu && (
              <div className="absolute right-0 top-10 w-64 bg-[#1B1E24] border border-[#2D3139] rounded-2xl shadow-2xl z-50 py-1.5 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
                <button
                  type="button"
                  onClick={() => {
                    setShowTopPlusMenu(false);
                    onNewChat?.();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-medium text-gray-200 hover:bg-[#252A32] flex items-center gap-2 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-blue-400" />
                  <span>Iniciar nuevo chat</span>
                </button>
                <div className="h-[1px] bg-[#2D3139] my-1" />
                <div className="max-h-60 overflow-y-auto divide-y divide-[#242830]/40">
                  {chatSessions.length === 0 ? (
                    <div className="px-4 py-3 text-[11px] text-gray-500 italic">
                      No hay chats previos
                    </div>
                  ) : (
                    chatSessions.map((session) => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => {
                          setShowTopPlusMenu(false);
                          onSelectSession?.(session);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-[#252A32] transition-colors group block"
                      >
                        <div className="text-xs text-gray-300 font-medium truncate group-hover:text-blue-400">
                          {session.title}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5">
                          {session.updatedAt}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Model & Agent Status Strip (Clickable to switch agents and configure API keys!) */}
      <div className="h-8 px-3.5 border-b border-[#242830] bg-[#12141A] flex items-center justify-between text-[11px] text-gray-400 font-medium shrink-0">
        <div className="flex items-center gap-2">
          {/* Interactive Agent Pill Button */}
          <button
            onClick={() => setIsAgentSelectorOpen(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#1A1D24] hover:bg-[#252A32] text-gray-200 border border-[#2D3139] hover:border-blue-500/50 transition-all cursor-pointer group"
            title="Haz clic para cambiar de Agente o configurar tus Claves API"
          >
            <div className="w-4 h-4 flex items-center justify-center shrink-0">
              <AgentLogo
                modelId={llmConfig.provider === 'b_ai' ? llmConfig.bAiModel : undefined}
                provider={llmConfig.provider}
                className="w-3.5 h-3.5"
              />
            </div>
            <span className="font-semibold text-blue-400 group-hover:text-blue-300 flex items-center gap-1">
              {llmConfig.provider === 'b_ai'
                ? llmConfig.bAiModel === 'auto'
                  ? 'Modo Auto'
                  : (llmConfig.bAiModel || 'Modo Auto')
                : llmConfig.provider === 'gemini'
                ? 'Gemini 3.8 Flash'
                : llmConfig.provider === 'groq'
                ? 'Groq (Llama 3.3)'
                : llmConfig.provider === 'deepseek'
                ? 'DeepSeek Coder-V3'
                : 'Custom LLM'}
            </span>
            <ChevronDown className="w-3 h-3 text-gray-400 group-hover:text-white" />
          </button>

          <span className="text-gray-600">•</span>
          <span className="text-gray-400 font-mono">
            {isGenerating
              ? 'Generando arquitectura...'
              : `Ejecutado en ${executionSeconds || 4}s`}
          </span>
        </div>

        {/* Quick API Keys Button */}
        <button
          onClick={() => setIsAgentSelectorOpen(true)}
          className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono transition-colors"
          title="Abrir configuración de Claves API y Agentes"
        >
          <Key className="w-3 h-3 text-blue-400" />
          <span>Claves API</span>
        </button>
      </div>

      {/* 3. Messages Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-4 bg-[#16191E]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1.5 text-xs ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            {/* Role indicator */}
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono px-1">
              {msg.role === 'user' ? (
                <>
                  <span>TÚ</span>
                  <User className="w-3 h-3 text-gray-400" />
                </>
              ) : (
                <>
                  <AgentLogo
                    modelId={llmConfig.provider === 'b_ai' ? llmConfig.bAiModel : undefined}
                    provider={llmConfig.provider}
                    className="w-3.5 h-3.5"
                  />
                  <span className="text-blue-400 font-medium">
                    {llmConfig.provider === 'b_ai'
                      ? llmConfig.bAiModel === 'auto'
                        ? 'AUTO-ROUTER IA'
                        : (llmConfig.bAiModel || 'AGENTE IA').toUpperCase()
                      : llmConfig.provider.toUpperCase()}
                  </span>
                </>
              )}
            </div>

            {/* Bubble */}
            <div
              className={`p-3.5 rounded-2xl max-w-[92%] leading-relaxed break-words shadow-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-sm'
                  : 'bg-[#1E2228] text-gray-200 border border-[#2D3139] rounded-tl-sm'
              }`}
            >
              {/* If user attached image/file in this message */}
              {msg.attachments && msg.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 pb-2 border-b border-white/10">
                  {msg.attachments.map((att) => (
                    <div
                      key={att.id}
                      className="flex items-center gap-1.5 bg-black/20 rounded-lg p-1 px-2 text-[10px]"
                    >
                      {att.type === 'image' && att.dataUrl ? (
                        <img src={att.dataUrl} alt={att.name} className="w-5 h-5 rounded object-cover" />
                      ) : att.type === 'drive' ? (
                        <GoogleDriveIcon className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      <span className="truncate max-w-[120px]">{att.name}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="whitespace-pre-wrap font-sans text-xs">{msg.content}</div>

              {/* Modified Files Chips */}
              {msg.filesModified && msg.filesModified.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-[#2D3139] flex flex-col gap-1.5">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    ARCHIVOS MODIFICADOS:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.filesModified.map((filePath) => (
                      <button
                        key={filePath}
                        onClick={() => onSelectFile(filePath)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0F1115] hover:bg-[#252a32] text-blue-400 border border-[#2D3139] text-[10px] font-mono transition-all"
                      >
                        <FileCode className="w-2.5 h-2.5 text-blue-400" />
                        <span>{filePath}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assistant Action Row */}
            {msg.role === 'assistant' && (
              <div className="flex items-center gap-3 px-1 pt-1 text-gray-400 text-xs select-none">
                <button
                  onClick={() => handleSaveCheckpoint(msg.id)}
                  className={`flex items-center gap-1 transition-colors ${
                    savedCheckpoints[msg.id]
                      ? 'text-blue-400 font-medium'
                      : 'hover:text-gray-200'
                  }`}
                  title="Guardar Checkpoint"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span className="text-[11px]">
                    {savedCheckpoints[msg.id] ? 'Punto de control guardado' : 'Punto de control'}
                  </span>
                </button>

                <button
                  onClick={() => handleFeedback(msg.id, 'like')}
                  className={`p-1 rounded hover:text-white transition-colors ${
                    messageFeedback[msg.id] === 'like' ? 'text-blue-400' : 'text-gray-400'
                  }`}
                  aria-label="Like response"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleFeedback(msg.id, 'dislike')}
                  className={`p-1 rounded hover:text-white transition-colors ${
                    messageFeedback[msg.id] === 'dislike' ? 'text-rose-400' : 'text-gray-400'
                  }`}
                  aria-label="Dislike response"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                </button>

                {msg.filesModified && msg.filesModified.length > 0 && (
                  <button
                    onClick={() =>
                      setDiffModalData({
                        filesModified: msg.filesModified || [],
                        previousFiles: msg.previousFiles,
                        checkpointFiles: msg.checkpointFiles,
                      })
                    }
                    className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    title="Ver diferencias exactas de código"
                  >
                    <GitCompare className="w-3 h-3" />
                    <span>Ver cambios ({msg.filesModified.length})</span>
                  </button>
                )}

                {msg.checkpointFiles && onRestoreCheckpoint && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Deseas restaurar el proyecto exactamente al estado de este punto?')) {
                        onRestoreCheckpoint(msg.checkpointFiles || []);
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-amber-300 transition-colors ml-auto bg-[#1A1D24] px-2 py-0.5 rounded border border-[#2D3139]"
                    title="Restaurar este checkpoint"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Restaurar</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#1A1D24] border border-[#2D3139] text-gray-300 text-xs font-mono">
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
            <span className="text-gray-300 text-xs">
              Diseñando componentes y transmitiendo código en vivo...
            </span>
          </div>
        )}
      </div>

      {/* 4. Input Area with Bottom (+) menu, attachments, and mic */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#0F1115] border-t border-[#242830] relative">
        {/* Hidden inputs for File & Camera */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => handleFileUpload(e, false)}
          multiple
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          onChange={(e) => handleFileUpload(e, true)}
          accept="image/*"
          capture="environment"
          className="hidden"
        />

        <div className="rounded-2xl bg-[#1A1D24] border border-[#2D3139] focus-within:border-blue-500/80 transition-all p-2.5 shadow-inner relative">
          {/* Attachments Card Preview (Screenshot 2 style) */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 p-1.5 rounded-xl bg-[#12141A] border border-[#2D3139]">
              {attachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center gap-2 p-1.5 px-2.5 rounded-xl bg-[#1E2228] border border-[#2D3139] text-xs text-white"
                >
                  {att.type === 'image' && att.dataUrl ? (
                    <img src={att.dataUrl} alt={att.name} className="w-8 h-8 rounded-lg object-cover" />
                  ) : att.type === 'drive' ? (
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <GoogleDriveIcon className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-blue-600/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                  <div className="flex flex-col min-w-0 pr-1">
                    <span className="text-xs font-medium text-gray-200 truncate max-w-[150px]">
                      {att.name}
                    </span>
                    <span className="text-[10px] text-gray-400 capitalize">
                      {att.type === 'drive' ? 'Google Drive' : att.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeAttachment(att.id)}
                    className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-[#2A2E37] transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Textarea */}
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Pregunta lo que sea o describe los cambios..."
            rows={2}
            disabled={isGenerating}
            className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 resize-none focus:outline-none font-sans leading-relaxed"
          />

          {/* Action Row Inside Container */}
          <div className="flex items-center justify-between pt-1.5 border-t border-[#242830]/60 relative">
            {/* Left: Circular (+) Button with Popup Menu (Screenshot 1: Drive, Upload Files, Camera) */}
            <div className="relative" ref={bottomMenuRef}>
              <button
                type="button"
                onClick={() => setShowBottomPlusMenu(!showBottomPlusMenu)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  showBottomPlusMenu
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#252A32] text-gray-300 hover:text-white hover:bg-[#2E343F]'
                }`}
                title="Adjuntar archivos, fotos o Drive"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Bottom (+) Popup Menu (Screenshot 1: Drive, Upload Files, Camera) */}
              {showBottomPlusMenu && (
                <div className="absolute bottom-11 left-0 w-44 bg-[#1B1E24] border border-[#2D3139] rounded-2xl shadow-2xl z-50 py-1.5 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setShowBottomPlusMenu(false);
                      setIsDriveModalOpen(true);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-gray-200 hover:bg-[#252A32] flex items-center gap-3 transition-colors"
                  >
                    <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                    <span>Google Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBottomPlusMenu(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-gray-200 hover:bg-[#252A32] flex items-center gap-3 transition-colors"
                  >
                    <Upload className="w-4 h-4 text-gray-300 shrink-0" />
                    <span>Subir archivos</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowBottomPlusMenu(false);
                      cameraInputRef.current?.click();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-gray-200 hover:bg-[#252A32] flex items-center gap-3 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-gray-300 shrink-0" />
                    <span>Cámara</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right: Mic Button + Arrow Up Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMic}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-500/40'
                    : 'bg-[#252A32] text-gray-300 hover:text-white hover:bg-[#2E343F]'
                }`}
                title={isListening ? 'Escuchando...' : 'Dictar por voz'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={(!inputPrompt.trim() && attachments.length === 0) || isGenerating}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  (inputPrompt.trim() || attachments.length > 0) && !isGenerating
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 active:scale-95'
                    : 'bg-[#252A32] text-gray-500 cursor-not-allowed opacity-50'
                }`}
                aria-label="Enviar prompt"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-300" />
                ) : (
                  <ArrowUp className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Google Drive Link Modal */}
      {isDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#16191E] border border-[#2D3139] rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <GoogleDriveIcon className="w-5 h-5" />
                <h3 className="text-sm font-semibold text-white">Adjuntar desde Google Drive</h3>
              </div>
              <button
                onClick={() => setIsDriveModalOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2228]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Pega el enlace compartido o ID de tu archivo en Google Drive (Docs, Sheets o archivo de código):
            </p>
            <form onSubmit={handleAttachDrive} className="space-y-3">
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/..."
                value={driveUrlInput}
                onChange={(e) => setDriveUrlInput(e.target.value)}
                className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsDriveModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!driveUrlInput.trim()}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white"
                >
                  Adjuntar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Agent & API Key Quick Selector Modal */}
      <AgentSelectorModal
        isOpen={isAgentSelectorOpen}
        onClose={() => setIsAgentSelectorOpen(false)}
        llmConfig={llmConfig}
        setLlmConfig={setLlmConfig}
      />

      {/* Visual Diff & Changes Modal */}
      {diffModalData && (
        <ChangesModal
          isOpen={true}
          onClose={() => setDiffModalData(null)}
          filesModified={diffModalData.filesModified}
          allFiles={allFiles}
          previousFiles={diffModalData.previousFiles}
          checkpointFiles={diffModalData.checkpointFiles}
          onRestoreCheckpoint={onRestoreCheckpoint}
          onSelectFile={(path) => {
            onSelectFile(path);
            setDiffModalData(null);
          }}
        />
      )}
    </div>
  );
};
