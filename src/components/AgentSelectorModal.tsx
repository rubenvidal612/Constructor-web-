import React, { useState, useMemo } from 'react';
import {
  X,
  Key,
  Bot,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Cpu,
  ShieldCheck,
  AlertCircle,
  Search,
  Zap,
  Code2,
  Layers,
  Wrench
} from 'lucide-react';
import { LLMConfig, LLMProvider } from '../types';
import {
  AgentLogo,
  AutoAgentIcon,
  GeminiIcon,
  DeepSeekIcon,
  OpenAIIcon,
  ClaudeIcon,
  QwenIcon,
  GLMIcon
} from './AgentIcons';

interface AgentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  llmConfig: LLMConfig;
  setLlmConfig: React.Dispatch<React.SetStateAction<LLMConfig>>;
}

export interface BAiModelItem {
  id: string;
  name: string;
  category: 'Routing' | 'DeepSeek' | 'OpenAI' | 'Claude' | 'Google' | 'Qwen' | 'GLM' | 'Other' | 'Agents';
  tag: string;
  description: string;
}

export const ALL_BAI_MODELS: BAiModelItem[] = [
  // Routing
  {
    id: 'auto',
    name: 'Modo Auto (Recomendado)',
    category: 'Routing',
    tag: '⚡ Recomendado / Auto',
    description: 'Cambia y alterna automáticamente entre los modelos óptimos según la tarea: razonamiento profundo para arquitectura y algoritmos, o modelos de alta velocidad para diseño y lógica de componentes.',
  },

  // DeepSeek Family
  {
    id: 'deepseek-v4-flash',
    name: 'DeepSeek-V4-Flash',
    category: 'DeepSeek',
    tag: 'Recomendado',
    description: 'Modelo insignia con latencia ultrabaja y generación de código de alta calidad.',
  },
  {
    id: 'deepseek-v3',
    name: 'DeepSeek-V3 (671B)',
    category: 'DeepSeek',
    tag: 'Frontier MoE',
    description: 'Modelo abierto de 671B parámetros con capacidades de programación y lógica líderes.',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek-R1',
    category: 'DeepSeek',
    tag: 'Razonamiento',
    description: 'Razonamiento paso a paso (Chain of Thought) para algoritmos y arquitectura compleja.',
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek-Coder 33B',
    category: 'DeepSeek',
    tag: 'Código Especializado',
    description: 'Afinado específicamente para escribir, documentar y depurar código fuente.',
  },

  // Anthropic Claude
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    category: 'Claude',
    tag: 'Híbrido Razonamiento',
    description: 'Combina respuesta instantánea y pensamiento extendido para desarrollo full-stack.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    category: 'Claude',
    tag: 'Top Coding',
    description: 'El estándar de oro para creación y edición de aplicaciones web.',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    category: 'Claude',
    tag: 'Ultra Rápido',
    description: 'Excelente velocidad y comprensión para modificaciones rápidas de interfaz.',
  },

  // OpenAI Family
  {
    id: 'gpt-5-mini',
    name: 'GPT-5 Mini',
    category: 'OpenAI',
    tag: 'Conversacional & Ágil',
    description: 'Modelo económico y veloz para tareas de programación y soporte general.',
  },
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    category: 'OpenAI',
    tag: 'Frontier Multimodal',
    description: 'Modelo de vanguardia con alta capacidad lógica y procesamiento multimodal.',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o (Omni)',
    category: 'OpenAI',
    tag: 'Multimodal',
    description: 'Lógica avanzada, visión y generación precisa de código frontend.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    category: 'OpenAI',
    tag: 'Económico',
    description: 'Ideal para llamadas iterativas continuas con bajo consumo de créditos.',
  },
  {
    id: 'o1',
    name: 'OpenAI o1',
    category: 'OpenAI',
    tag: 'Lógica Profunda',
    description: 'Diseñado para matemáticas, algoritmos avanzados y diseño de sistemas.',
  },
  {
    id: 'o3-mini',
    name: 'OpenAI o3-mini',
    category: 'OpenAI',
    tag: 'Razonamiento STEM',
    description: 'Razonamiento conciso y veloz en resolución de problemas técnicos.',
  },

  // GLM (Zhipu AI)
  {
    id: 'glm-5.3-flash',
    name: 'GLM-5.3-Flash',
    category: 'GLM',
    tag: '1M Context',
    description: 'Arquitectura híbrida dispersa-lineal, 1 millón de tokens para bases de código completas.',
  },
  {
    id: 'glm-4-plus',
    name: 'GLM-4 Plus',
    category: 'GLM',
    tag: 'Instrucciones Complejas',
    description: 'Excelente seguimiento de directivas estructuradas y generación JSON.',
  },

  // Alibaba Qwen
  {
    id: 'qwen3.8-flash',
    name: 'Qwen 3.8 Flash',
    category: 'Qwen',
    tag: 'Agente Rápido',
    description: 'Optimizado para interacciones en tiempo real y asistencia de agentes.',
  },
  {
    id: 'qwen-2.5-coder-32b',
    name: 'Qwen 2.5 Coder 32B',
    category: 'Qwen',
    tag: 'Top Open Code',
    description: 'Uno de los modelos abiertos más potentes para programación y refactorización.',
  },
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen 2.5 72B Instruct',
    category: 'Qwen',
    tag: 'Gran Capacidad',
    description: 'Comprensión multilingüe y razonamiento para desarrollo complejo.',
  },

  // Google Gemini
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    category: 'Google',
    tag: '⚡ 100% Gratis / Google AI Studio',
    description: 'Completamente gratuito, ultrarrápido y nativo de Google AI Studio. Listo para usar sin configurar API Key.',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    category: 'Google',
    tag: 'Multimodal Pro',
    description: 'Alta precisión analítica para código complejo y arquitectura avanzada con fallback automático.',
  },
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro (2M Tokens)',
    category: 'Google',
    tag: '2M Context',
    description: 'Capacidad de procesar repositorios enteros en una sola llamada.',
  },

  // Tencent, Xiaomi, Kimi, MiniMax
  {
    id: 'tencent-hy3',
    name: 'Tencent Hunyuan 3 (Hy3)',
    category: 'Other',
    tag: 'Free Gateway',
    description: 'Modelo de Tencent optimizado para razonamiento y respuestas rápidas.',
  },
  {
    id: 'mimo-v2.5',
    name: 'Xiaomi MiMo-V2.5',
    category: 'Other',
    tag: 'Ligero',
    description: 'Optimizado para respuestas sintéticas y ejecución rápida.',
  },
  {
    id: 'kimi-k1.5',
    name: 'Moonshot Kimi K1.5',
    category: 'Other',
    tag: 'Contexto Largo',
    description: 'Especialista en lectura y análisis de código extenso.',
  },
  {
    id: 'minimax-abab6.5',
    name: 'MiniMax Abab 6.5',
    category: 'Other',
    tag: 'General',
    description: 'Modelo equilibrado para procesamiento de lenguaje natural y código.',
  },

  // Herramientas de Agentes
  {
    id: 'openclaw',
    name: 'OpenClaw Agent Runner',
    category: 'Agents',
    tag: 'Agente Autónomo',
    description: 'Ejecutor de agentes para automatización y diseño de flujos de trabajo.',
  },
  {
    id: 'code-agent',
    name: 'Code CLI Agent',
    category: 'Agents',
    tag: 'Programador CLI',
    description: 'Asistente de programación con memoria de sesiones y costos optimizados.',
  },
];

export const AgentSelectorModal: React.FC<AgentSelectorModalProps> = ({
  isOpen,
  onClose,
  llmConfig,
  setLlmConfig,
}) => {
  // Always default to 'b_ai' when opening the B.AI catalog
  const [activeTab, setActiveTab] = useState<'b_ai' | 'other'>(
    llmConfig.provider === 'b_ai' || !llmConfig.provider ? 'b_ai' : 'other'
  );
  const [provider, setProvider] = useState<LLMProvider>(llmConfig.provider || 'b_ai');
  const [bAiKey, setBAiKey] = useState<string>(llmConfig.bAiApiKey || '');
  const [bAiModel, setBAiModel] = useState<string>(llmConfig.bAiModel || 'deepseek-v4-flash');
  const [customApiKey, setCustomApiKey] = useState<string>(llmConfig.customApiKey || '');
  const [customModel, setCustomModel] = useState<string>(llmConfig.modelName || '');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<{ success: boolean; msg: string } | null>(null);
  const [fetchedModels, setFetchedModels] = useState<string[]>([]);
  const [customAgentInput, setCustomAgentInput] = useState('');
  const [keySource, setKeySource] = useState<'included' | 'byok'>(
    llmConfig.bAiApiKey && llmConfig.bAiApiKey.trim().length > 0 ? 'byok' : 'included'
  );

  // When switching tabs, adjust provider accordingly
  const handleTabChange = (tab: 'b_ai' | 'other') => {
    setActiveTab(tab);
    if (tab === 'b_ai') {
      setProvider('b_ai');
    } else if (provider === 'b_ai') {
      setProvider('gemini');
    }
  };

  // Filter models based on search query and category tab
  const filteredModels = useMemo(() => {
    return ALL_BAI_MODELS.filter((m) => {
      const matchesSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'deepseek' && m.category === 'DeepSeek') ||
        (selectedCategory === 'claude' && m.category === 'Claude') ||
        (selectedCategory === 'openai' && m.category === 'OpenAI') ||
        (selectedCategory === 'qwen_glm' && (m.category === 'Qwen' || m.category === 'GLM')) ||
        (selectedCategory === 'google_other' && (m.category === 'Google' || m.category === 'Other')) ||
        (selectedCategory === 'agents' && (m.category === 'Agents' || m.category === 'Routing'));

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  if (!isOpen) return null;

  const handleTestBAi = async () => {
    if (!bAiKey.trim()) {
      setVerifyStatus({ success: false, msg: 'Por favor ingresa la clave de acceso' });
      return;
    }
    setVerifying(true);
    setVerifyStatus(null);
    try {
      const res = await fetch('/api/ai/b_ai/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: bAiKey.trim() }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.models)) {
        const ids = data.models.map((m: any) => m.id || m.name || String(m));
        setFetchedModels(ids);
        setVerifyStatus({
          success: true,
          msg: `¡Conexión exitosa con el motor de IA! Se sincronizaron ${ids.length} modelos.`,
        });
      } else {
        setVerifyStatus({
          success: false,
          msg: data.error || 'No se pudo conectar con el motor de IA. Verifica tu clave.',
        });
      }
    } catch (err: any) {
      setVerifyStatus({
        success: false,
        msg: `Error conectando con el motor de IA: ${err.message}`,
      });
    } finally {
      setVerifying(false);
    }
  };

  const handleSelectModel = (id: string) => {
    setBAiModel(id);
    if (id.startsWith('gemini')) {
      setProvider('gemini');
    } else {
      setProvider('b_ai');
    }
  };

  const handleSave = () => {
    const isGemini = bAiModel.startsWith('gemini') || provider === 'gemini';
    const finalProvider = isGemini ? 'gemini' : (activeTab === 'b_ai' ? 'b_ai' : provider);
    const chosenModel =
      bAiModel === 'custom_agent' && customAgentInput.trim()
        ? customAgentInput.trim()
        : bAiModel;

    const matched = ALL_BAI_MODELS.find((m) => m.id === chosenModel);
    const labelModel = matched ? matched.name : chosenModel;

    const finalKey = keySource === 'byok' ? bAiKey.trim() : '';

    setLlmConfig({
      ...llmConfig,
      provider: finalProvider,
      bAiApiKey: finalKey,
      bAiModel: chosenModel,
      customApiKey: customApiKey.trim(),
      modelName:
        finalProvider === 'gemini'
          ? labelModel || 'Gemini 2.5 Flash'
          : finalProvider === 'b_ai'
          ? chosenModel === 'auto'
            ? 'Modo Auto'
            : labelModel
          : finalProvider === 'groq'
          ? 'Groq (Llama 3.3)'
          : finalProvider === 'deepseek'
          ? 'DeepSeek Coder-V3'
          : customModel || 'Custom LLM',
    });
    onClose();
  };

  const categoryTabs = [
    { id: 'all', label: `Todos (${ALL_BAI_MODELS.length})`, iconCat: 'all' },
    { id: 'deepseek', label: 'DeepSeek (4)', iconCat: 'deepseek' },
    { id: 'claude', label: 'Claude (3)', iconCat: 'claude' },
    { id: 'openai', label: 'OpenAI (6)', iconCat: 'openai' },
    { id: 'qwen_glm', label: 'Qwen & GLM (5)', iconCat: 'qwen' },
    { id: 'google_other', label: 'Google & Otros (7)', iconCat: 'google' },
    { id: 'agents', label: 'Agentes & Auto (3)', iconCat: 'auto' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#16191E] border border-[#2D3139] rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[94vh]">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#242830] flex items-center justify-between bg-[#12141A] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-white">Catálogo de Agentes & Modelos de IA</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  {ALL_BAI_MODELS.length}+ Modelos
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Selecciona y optimiza el motor de inteligencia artificial para tu proyecto
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2228] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Top Tab Switcher */}
        <div className="px-4 sm:px-5 pt-3 pb-1 border-b border-[#242830] bg-[#14171E] shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTabChange('b_ai')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === 'b_ai'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-[#1A1D24] text-gray-400 hover:text-gray-200 hover:bg-[#20242D]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Catálogo de Modelos ({ALL_BAI_MODELS.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('other')}
              className={`py-2 px-3 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'other'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
                  : 'bg-[#1A1D24] text-gray-400 hover:text-gray-200 hover:bg-[#20242D]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Otros Proveedores</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-3.5 sm:p-5 overflow-y-auto space-y-4 text-xs text-gray-300">
          {activeTab === 'b_ai' ? (
            <>
              {/* API Key Box / Modo de Conexión y Cuota */}
              <div className="p-3.5 rounded-xl bg-[#12161F] border border-[#2D3139] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Key className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white font-semibold">Fuente de Facturación &amp; Clave de API</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {keySource === 'byok' ? 'Tu Clave Personal (BYOK)' : 'Incluida en el Servidor'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {keySource === 'byok'
                          ? 'Las peticiones se procesan y facturan a tu cuenta privada de API.'
                          : 'Listo para usar con la infraestructura preconfigurada en la plataforma.'}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Selector */}
                  <div className="flex items-center p-0.5 bg-[#1A1D24] border border-[#2D3139] rounded-lg shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setKeySource('included');
                        setVerifyStatus(null);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                        keySource === 'included'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      Clave Incluida
                    </button>
                    <button
                      type="button"
                      onClick={() => setKeySource('byok')}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all flex items-center gap-1 ${
                        keySource === 'byok'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      <Key className="w-3 h-3" />
                      <span>Usar Mi Clave</span>
                    </button>
                  </div>
                </div>

                {keySource === 'byok' ? (
                  <div className="pt-2.5 border-t border-[#222630] space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-gray-300 font-medium flex items-center gap-1.5">
                        <span>Ingresa tu clave de API personal (sk-...)</span>
                      </label>
                      <span className="text-[10px] text-gray-400">
                        Consumos facturados a tu cuenta privada
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="sk-... pega aquí tu clave personal de API"
                        value={bAiKey}
                        onChange={(e) => setBAiKey(e.target.value)}
                        className="flex-1 bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={handleTestBAi}
                        disabled={verifying}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium transition-all shrink-0 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        {verifying ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <ShieldCheck className="w-3.5 h-3.5" />
                        )}
                        <span>{verifying ? 'Probando...' : 'Verificar y Conectar'}</span>
                      </button>
                    </div>

                    {verifyStatus && (
                      <div
                        className={`flex items-start gap-1.5 p-2 rounded-lg text-[11px] ${
                          verifyStatus.success
                            ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {verifyStatus.success ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-400" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-rose-400" />
                        )}
                        <span>{verifyStatus.msg}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 border-t border-[#222630]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Motor listo con la infraestructura predeterminada de la app
                    </span>
                    <button
                      type="button"
                      onClick={() => setKeySource('byok')}
                      className="text-blue-400 hover:text-blue-300 hover:underline font-medium text-left sm:text-right"
                    >
                      ¿Tienes tu propia cuenta de pago? Haz clic aquí para usar tu propia clave
                    </button>
                  </div>
                )}
              </div>

              {/* Modo Recomendado / Auto-Router Inteligente Highlight Banner */}
              <div
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  bAiModel === 'auto'
                    ? 'bg-gradient-to-r from-blue-950/70 via-indigo-950/50 to-[#141822] border-blue-500 ring-1 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                    : 'bg-[#12161F] border-[#2A303C] hover:border-blue-500/40'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="w-7 h-7 rounded-xl bg-blue-600/25 border border-blue-500/40 flex items-center justify-center p-1 shrink-0 shadow-sm">
                      <AutoAgentIcon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs text-white">
                      Modo Auto (Recomendado)
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                      Auto-Switch
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 max-w-lg leading-relaxed">
                    Cambia y alterna automáticamente entre los modelos óptimos según la tarea: asigna motores de razonamiento profundo para arquitectura y algoritmos complejos, y motores de alta velocidad para cambios visuales y componentes interactivos.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBAiModel('auto');
                    setProvider('b_ai');
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all flex items-center justify-center gap-1.5 ${
                    bAiModel === 'auto'
                      ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25 border border-blue-400'
                      : 'bg-[#1E222A] text-gray-200 hover:bg-blue-600 hover:text-white border border-[#2D3139]'
                  }`}
                >
                  {bAiModel === 'auto' ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Modo Auto Activo</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-blue-400" />
                      <span>Activar Modo Auto</span>
                    </>
                  )}
                </button>
              </div>

              {/* Category Filter Pills */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
                    Modelos de IA Disponibles ({filteredModels.length})
                  </span>
                  {bAiModel && (
                    <span className="text-[10px] text-blue-400 font-mono flex items-center gap-1.5">
                      <span className="text-gray-400">Activo:</span>
                      <span className="inline-flex items-center gap-1 bg-[#1A1D24] px-2 py-0.5 rounded border border-[#2D3139]">
                        <AgentLogo modelId={bAiModel} className="w-3 h-3" />
                        <strong className="text-white">{bAiModel}</strong>
                      </span>
                    </span>
                  )}
                </div>

                {/* Horizontal scrollable pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                  {categoryTabs.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                        selectedCategory === cat.id
                          ? 'bg-blue-600 text-white shadow-sm font-semibold'
                          : 'bg-[#1A1D24] text-gray-400 hover:text-white hover:bg-[#252A32]'
                      }`}
                    >
                      {cat.iconCat !== 'all' && (
                        <AgentLogo category={cat.iconCat} className="w-3.5 h-3.5" />
                      )}
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Buscar modelo o agente (ej: claude, r1, flash, gpt, qwen, coder)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl pl-8 pr-8 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-gray-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Models List - All 28 models rendered in clean cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] sm:max-h-[380px] overflow-y-auto pr-1">
                {filteredModels.map((m) => {
                  const isSelected = bAiModel === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectModel(m.id)}
                      className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 group ${
                        isSelected
                          ? 'border-blue-500 bg-blue-600/20 text-white ring-1 ring-blue-500 shadow-lg shadow-blue-500/10'
                          : 'border-[#252A32] bg-[#161A22] text-gray-300 hover:border-gray-600 hover:bg-[#1C212B]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-all p-1 ${
                              isSelected
                                ? 'bg-blue-600/30 border-blue-400/60 shadow-sm shadow-blue-500/20 ring-1 ring-blue-400/40'
                                : 'bg-[#1F232D] border-[#2C323F] group-hover:border-gray-500'
                            }`}
                          >
                            <AgentLogo modelId={m.id} category={m.category} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`font-semibold text-xs truncate ${
                                isSelected ? 'text-blue-300 font-bold' : 'text-gray-100 group-hover:text-white'
                              }`}
                            >
                              {m.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                              <span>{m.category}</span>
                              {isSelected && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                              )}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[9px] px-2 py-0.5 rounded-md font-mono shrink-0 whitespace-nowrap ${
                            isSelected
                              ? 'bg-blue-500 text-white font-semibold shadow-sm'
                              : 'bg-[#222733] text-blue-300 border border-blue-900/30'
                          }`}
                        >
                          {m.tag}
                        </span>
                      </div>

                      <p className="text-[10px] text-gray-400 leading-normal line-clamp-2">
                        {m.description}
                      </p>

                      <div className="flex items-center justify-between pt-1.5 border-t border-[#242830]/80 text-[10px] text-gray-500 font-mono">
                        <span>ID: {m.id}</span>
                        {isSelected ? (
                          <span className="text-blue-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Seleccionado
                          </span>
                        ) : (
                          <span className="text-gray-500 group-hover:text-blue-300 text-[9px] transition-colors">
                            Seleccionar &rarr;
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {/* Custom Agent Option */}
                <button
                  type="button"
                  onClick={() => setBAiModel('custom_agent')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 group ${
                    bAiModel === 'custom_agent'
                      ? 'border-blue-500 bg-blue-600/20 text-white ring-1 ring-blue-500 shadow-md'
                      : 'border-dashed border-[#2D3139] bg-[#161A22] text-gray-400 hover:border-blue-500/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#1F232D] border border-[#2C323F] flex items-center justify-center shrink-0 p-1">
                      <Wrench className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-blue-400">Agente Personalizado</div>
                      <div className="text-[10px] text-gray-500 font-mono">Custom fine-tune / bot</div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400">
                    Ingresa manualmente el ID de un bot o fine-tune privado.
                  </p>
                  <div className="flex items-center justify-between pt-1.5 border-t border-[#242830]/80 text-[10px] text-gray-500 font-mono">
                    <span>ID: manual</span>
                    {bAiModel === 'custom_agent' && (
                      <span className="text-blue-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Activo
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Custom agent input box */}
              {bAiModel === 'custom_agent' && (
                <div className="p-3 rounded-xl bg-[#1A1D24] border border-blue-500/50 space-y-1.5">
                  <label className="text-[11px] text-blue-400 font-medium">
                    ID exacto del Agente:
                  </label>
                  <input
                    type="text"
                    placeholder="Ejemplo: openclaw-analyst, my-custom-agent..."
                    value={customAgentInput}
                    onChange={(e) => setCustomAgentInput(e.target.value)}
                    className="w-full bg-[#12161F] border border-[#2D3139] rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    autoFocus
                  />
                </div>
              )}
            </>
          ) : (
            /* Other Providers Tab */
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setProvider('gemini')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    provider === 'gemini'
                      ? 'border-purple-500 bg-purple-600/15 text-white ring-1 ring-purple-500'
                      : 'border-[#2D3139] bg-[#1A1D24] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-xs text-purple-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-600/20 border border-purple-500/30 flex items-center justify-center p-1 shrink-0">
                      <GeminiIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>Gemini 3.8 Flash</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Google AI Studio nativo</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('groq')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    provider === 'groq'
                      ? 'border-amber-500 bg-amber-600/15 text-white ring-1 ring-amber-500'
                      : 'border-[#2D3139] bg-[#1A1D24] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-xs text-amber-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center p-1 shrink-0">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <span>Groq Fast</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">Llama 3.3 70B</div>
                </button>

                <button
                  type="button"
                  onClick={() => setProvider('deepseek')}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between gap-1.5 ${
                    provider === 'deepseek'
                      ? 'border-blue-500 bg-blue-600/15 text-white ring-1 ring-blue-500'
                      : 'border-[#2D3139] bg-[#1A1D24] text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="font-semibold text-xs text-blue-300 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center p-1 shrink-0">
                      <DeepSeekIcon className="w-3.5 h-3.5" />
                    </div>
                    <span>DeepSeek Direct</span>
                  </div>
                  <div className="text-[10px] text-gray-400 mt-1">DeepSeek Coder-V3</div>
                </button>
              </div>

              {provider !== 'gemini' && (
                <div className="p-4 rounded-xl bg-[#12161F] border border-[#2D3139] space-y-2">
                  <label className="text-xs text-gray-200 font-medium flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-400" />
                    API Key para {provider.toUpperCase()}
                  </label>
                  <input
                    type="password"
                    placeholder={`Ingresa tu API Key de ${provider}...`}
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="w-full bg-[#1A1D24] border border-[#2D3139] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#242830] bg-[#12141A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-gray-400 truncate max-w-[200px] sm:max-w-none">
            <div className="w-5 h-5 rounded-md bg-[#1F232D] border border-[#2C323F] flex items-center justify-center shrink-0 p-0.5">
              <AgentLogo
                modelId={activeTab === 'b_ai' ? (bAiModel === 'custom_agent' ? customAgentInput : bAiModel) : undefined}
                provider={provider}
                className="w-3.5 h-3.5"
              />
            </div>
            <span>
              Activo:{' '}
              <strong className="text-blue-400 font-semibold font-mono">
                {activeTab === 'b_ai'
                  ? bAiModel === 'custom_agent'
                    ? customAgentInput || 'personalizado'
                    : bAiModel
                  : provider}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-[#1E2228] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              Guardar y Activar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

