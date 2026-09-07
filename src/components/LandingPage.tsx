import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Menu,
  Zap,
  Shield,
  Layers,
  Terminal,
  Cpu,
  Database,
  Cloud,
  Github,
  ChevronDown,
  ChevronUp,
  User,
  Crown,
  Laptop,
  Flame,
  Check,
  Play,
  Copy,
} from 'lucide-react';
import { AppUser } from '../types';
import { ClaudeIcon, DeepSeekIcon, OpenAIIcon, GeminiIcon } from './AgentIcons';

interface LandingPageProps {
  onEnterStudio: (initialPrompt?: string) => void;
  onOpenAuthModal: (plan?: 'free' | 'pro' | 'team') => void;
  currentUser: AppUser | null;
  onOpenPaletteMenu: () => void;
  onUserRegister: (user: AppUser) => void;
}

export function LandingPage({
  onEnterStudio,
  onOpenAuthModal,
  currentUser,
  onOpenPaletteMenu,
  onUserRegister,
}: LandingPageProps) {
  // Hero interactive prompt input
  const [heroPrompt, setHeroPrompt] = useState('');
  const [activeInteractiveTab, setActiveInteractiveTab] = useState<'preview' | 'code' | 'agent'>('preview');

  // Interactive demo preview state
  const [demoLikes, setDemoLikes] = useState(42);
  const [demoCopied, setDemoCopied] = useState(false);

  // On-page registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPlan, setRegPlan] = useState<'free' | 'pro' | 'team'>('free');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState(false);

  // FAQ accordion state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnterStudio(heroPrompt.trim());
  };

  const handleQuickPrompt = (promptText: string) => {
    setHeroPrompt(promptText);
    onEnterStudio(promptText);
  };

  const handleOnPageRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regEmail || !regEmail.includes('@')) {
      setRegError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const newUser: AppUser = {
      id: 'usr-' + Date.now(),
      name: regName.trim() || regEmail.split('@')[0],
      email: regEmail.trim().toLowerCase(),
      registeredAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      plan: regPlan,
      modelPreference: 'Claude 3.7 & DeepSeek V3',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(regEmail)}`,
    };

    const existingUsersRaw = localStorage.getItem('ais_registered_users');
    const existingUsers: AppUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];
    const updated = [newUser, ...existingUsers.filter(u => u.email !== newUser.email)];
    localStorage.setItem('ais_registered_users', JSON.stringify(updated));
    localStorage.setItem('ais_current_user', JSON.stringify(newUser));

    setRegSuccess(true);
    setTimeout(() => {
      onUserRegister(newUser);
      onEnterStudio();
    }, 1000);
  };

  const faqs = [
    {
      q: '¿Qué es Web AI Studio y en qué se diferencia de otras herramientas?',
      a: 'Web AI Studio es un entorno de desarrollo full-stack integrado con agentes de Inteligencia Artificial que escriben, compilan y ejecutan código web en tiempo real. A diferencia de simples maquetas, aquí obtienes proyectos con archivos reales, previsualización interactiva instantánea, y capacidad de despliegue directo a Vercel y GitHub.',
    },
    {
      q: '¿El código generado me pertenece al 100%?',
      a: 'Sí, absolutamente. Todo el código fuente HTML, TypeScript, Tailwind y backend es tuyo sin ninguna atadura de proveedor. Puedes descargar el proyecto completo en archivo .ZIP con un solo clic o sincronizarlo con tu repositorio de GitHub.',
    },
    {
      q: '¿Qué modelos de Inteligencia Artificial puedo utilizar?',
      a: 'Soportamos los modelos de vanguardia más potentes: Claude 3.7 Sonnet con razonamiento híbrido, DeepSeek V3, OpenAI GPT-4o, Google Gemini 2.5 Flash y Qwen 2.5 Coder. Puedes alternar entre ellos según la complejidad de tu tarea.',
    },
    {
      q: '¿Necesito tarjeta de crédito para registrarme?',
      a: 'No. El plan gratuito Starter no requiere ninguna tarjeta de crédito. Puedes crear tu cuenta, comenzar a desarrollar tus aplicaciones y desplegarlas de inmediato.',
    },
    {
      q: '¿Cómo conecto mi base de datos o autenticación?',
      a: 'Contamos con integración nativa con Supabase PostgreSQL. Con solo ingresar tu URL y clave anónima en el Studio, tus aplicaciones tendrán persistencia de datos real, tablas y autenticación de usuarios.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] selection:bg-blue-500 selection:text-white font-sans overflow-x-hidden">
      {/* ========================================================
          1. TOP NAVIGATION HEADER
         ======================================================== */}
      <header className="sticky top-0 z-40 w-full bg-[#0A0C10]/85 backdrop-blur-md border-b border-[#1E232E] px-4 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Hamburger Button (3 horizontal lines) & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPaletteMenu}
              className="p-2 rounded-xl bg-[#141822] hover:bg-[#1C2230] border border-[#262D3D] text-gray-300 hover:text-white transition-all shadow-sm flex items-center gap-2 group cursor-pointer"
              title="Abrir menú de paleta (3 líneas)"
              id="landing-hamburger-btn"
            >
              <Menu className="w-5 h-5 text-blue-400 group-hover:scale-105 transition-transform" />
              <span className="hidden sm:inline text-xs font-semibold text-gray-300">Menú</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm tracking-tight text-white font-mono">
                WEBAI<span className="text-blue-400">.STUDIO</span>
              </span>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-400">
            <a href="#caracteristicas" className="hover:text-white transition-colors">Características</a>
            <a href="#modelos" className="hover:text-white transition-colors">Modelos IA</a>
            <a href="#demo" className="hover:text-white transition-colors">Demostración</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
            <a href="#registro" className="hover:text-white transition-colors">Registro</a>
            <a href="#faq" className="hover:text-white transition-colors">Preguntas</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-[#141822] border border-[#252B3A] rounded-xl text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-gray-300 font-medium">{currentUser.name}</span>
                </div>
                <button
                  onClick={() => onEnterStudio()}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Ir al Studio</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuthModal('free')}
                  className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => onOpenAuthModal('free')}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Registrarse Gratis</span>
                </button>
                <button
                  onClick={() => onEnterStudio()}
                  className="px-3 py-1.5 rounded-xl bg-[#171B26] hover:bg-[#202535] border border-[#283042] text-blue-300 hover:text-white font-semibold text-xs transition-all flex items-center gap-1 cursor-pointer"
                  title="Abrir el entorno de desarrollo directamente"
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Studio IDE</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================
          2. HERO SECTION WITH LIVE PROMPT BUILDER
         ======================================================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[250px] bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative text-center max-w-4xl mx-auto space-y-6">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/50 border border-blue-500/30 text-blue-300 text-xs font-semibold shadow-inner">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Desarrollo Web Full-Stack 100% Funcional con IA</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
            Convierte tus Ideas en{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400">
              Aplicaciones Web Reales
            </span>{' '}
            en Minutos
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Escribe tu idea en lenguaje natural. Nuestros agentes con{' '}
            <span className="text-white font-semibold">Claude 3.7, DeepSeek V3 y GPT-4o</span>{' '}
            generan la arquitectura completa, código React limpio, previsualización interactiva en vivo y despliegue a producción.
          </p>

          {/* Interactive Live Prompt Box in Hero */}
          <div className="max-w-2xl mx-auto pt-4">
            <form
              onSubmit={handleHeroSubmit}
              className="bg-[#121620] border border-[#283042] p-2.5 rounded-2xl shadow-2xl focus-within:border-blue-500 transition-all text-left"
            >
              <div className="flex items-start gap-3 p-2">
                <Sparkles className="w-5 h-5 text-blue-400 mt-1 shrink-0" />
                <textarea
                  value={heroPrompt}
                  onChange={(e) => setHeroPrompt(e.target.value)}
                  placeholder="Describe lo que quieres construir... (ej: Un SaaS Dashboard para métricas de Stripe con gráficos y filtros por fecha)"
                  rows={2}
                  className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 outline-none resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-[#1E2432] px-2">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <div className="flex items-center -space-x-1">
                    <ClaudeIcon className="w-3.5 h-3.5" />
                    <DeepSeekIcon className="w-3.5 h-3.5" />
                    <GeminiIcon className="w-3.5 h-3.5" />
                  </div>
                  <span>Multi-Modelo: Claude 3.7 • DeepSeek V3 • Gemini 2.5</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <span>Generar en el Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
              <span className="text-gray-500 text-[11px]">Ideas populares:</span>
              <button
                type="button"
                onClick={() => handleQuickPrompt('SaaS Dashboard con analítica de usuarios y cobros')}
                className="px-2.5 py-1 bg-[#141824] hover:bg-[#1E2434] border border-[#242C3E] rounded-lg text-gray-300 hover:text-white text-[11px] transition-all"
              >
                📊 Dashboard SaaS
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('E-Commerce con carrito interactivo y checkout con tarjeta')}
                className="px-2.5 py-1 bg-[#141824] hover:bg-[#1E2434] border border-[#242C3E] rounded-lg text-gray-300 hover:text-white text-[11px] transition-all"
              >
                🛒 Tienda E-Commerce
              </button>
              <button
                type="button"
                onClick={() => handleQuickPrompt('Tablero Kanban interactivo con drag & drop y persistencia Supabase')}
                className="px-2.5 py-1 bg-[#141824] hover:bg-[#1E2434] border border-[#242C3E] rounded-lg text-gray-300 hover:text-white text-[11px] transition-all"
              >
                📋 Tablero Kanban
              </button>
            </div>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>+12,400 Apps creadas</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>Exportación limpia en ZIP</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>Despliegue directo en Vercel</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
              <span>Sin maquetas falsas</span>
            </span>
          </div>
        </div>

        {/* ========================================================
            3. INTERACTIVE SIMULATOR SHOWCASE (DEMO WIDGET)
           ======================================================== */}
        <div id="demo" className="mt-14 max-w-5xl mx-auto">
          <div className="bg-[#11141D] border border-[#252C3D] rounded-2xl shadow-2xl overflow-hidden">
            {/* Fake Window Header */}
            <div className="bg-[#0C0F16] border-b border-[#202636] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-xs font-mono text-gray-400">webai-studio-preview://workspace</span>
              </div>

              {/* Tabs */}
              <div className="flex items-center bg-[#151A24] p-1 rounded-xl border border-[#242B3A]">
                <button
                  onClick={() => setActiveInteractiveTab('preview')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeInteractiveTab === 'preview'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Vista Previa Interactiva
                </button>
                <button
                  onClick={() => setActiveInteractiveTab('code')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeInteractiveTab === 'code'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Código Real (React)
                </button>
                <button
                  onClick={() => setActiveInteractiveTab('agent')}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeInteractiveTab === 'agent'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Agente IA (DeepSeek & Claude)
                </button>
              </div>

              <button
                onClick={() => onEnterStudio()}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
              >
                <span>Abrir en Pantalla Completa</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tab 1: Live Interactive Preview */}
            {activeInteractiveTab === 'preview' && (
              <div className="p-6 sm:p-8 bg-[#0D1017]">
                <div className="max-w-xl mx-auto bg-[#141822] border border-[#262D3E] rounded-2xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800/40">
                        Componente Activo
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">
                        SaaS Growth Engine v2.4
                      </h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold">
                      99%
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">
                    Este es un ejemplo de componente interactivo que los agentes compilan de forma autónoma. Puedes interactuar con los botones en tiempo real:
                  </p>

                  <div className="grid grid-cols-2 gap-3 py-2">
                    <div className="p-3 bg-[#0E1119] rounded-xl border border-[#202736]">
                      <div className="text-[11px] text-gray-500">Usuarios Activos</div>
                      <div className="text-xl font-bold text-emerald-400 font-mono">14,289</div>
                      <div className="text-[10px] text-emerald-500 mt-0.5">↑ +24.8% este mes</div>
                    </div>
                    <div className="p-3 bg-[#0E1119] rounded-xl border border-[#202736]">
                      <div className="text-[11px] text-gray-500">Ingresos MRR</div>
                      <div className="text-xl font-bold text-white font-mono">$38,450</div>
                      <div className="text-[10px] text-blue-400 mt-0.5">Stripe sincronizado</div>
                    </div>
                  </div>

                  {/* Interactive Button Demo */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDemoLikes((prev) => prev + 1)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-transform active:scale-95 flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                      >
                        <span>❤️ Me Gusta</span>
                        <span className="font-mono bg-blue-800/60 px-1.5 py-0.2 rounded text-[10px]">
                          {demoLikes}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          setDemoCopied(true);
                          setTimeout(() => setDemoCopied(false), 2000);
                        }}
                        className="px-3 py-1.5 bg-[#1B202D] hover:bg-[#252B3C] border border-[#2F374A] text-gray-300 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{demoCopied ? '¡Copiado!' : 'Copiar API'}</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onEnterStudio()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline"
                    >
                      Editar en el Studio &rarr;
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Real Code Tab */}
            {activeInteractiveTab === 'code' && (
              <div className="p-6 bg-[#0B0D13] font-mono text-xs overflow-x-auto text-gray-300 space-y-2">
                <div className="text-gray-500">// Archivo: /src/components/SaaSMetrics.tsx</div>
                <div><span className="text-purple-400">import</span> React, &#123; useState, useEffect &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'react'</span>;</div>
                <div><span className="text-purple-400">import</span> &#123; createClient &#125; <span className="text-purple-400">from</span> <span className="text-emerald-300">'@supabase/supabase-js'</span>;</div>
                <div className="pt-2"><span className="text-blue-400">export function</span> <span className="text-amber-300">SaaSMetrics</span>() &#123;</div>
                <div className="pl-4"><span className="text-blue-400">const</span> [metrics, setMetrics] = <span className="text-amber-300">useState</span>(&#123; users: <span className="text-orange-400">14289</span>, mrr: <span className="text-orange-400">38450</span> &#125;);</div>
                <div className="pl-4"><span className="text-gray-500">// Agente IA genera consultas reales con RLS seguro</span></div>
                <div className="pl-4"><span className="text-purple-400">return</span> (</div>
                <div className="pl-8 text-blue-300">&lt;div className="grid grid-cols-2 gap-4 p-6 bg-[#141822] rounded-2xl"&gt;</div>
                <div className="pl-12 text-gray-300">&lt;MetricCard title="MRR" value=&#123;metrics.mrr&#125; /&gt;</div>
                <div className="pl-8 text-blue-300">&lt;/div&gt;</div>
                <div className="pl-4">);</div>
                <div>&#125;</div>
              </div>
            )}

            {/* Tab 3: Agent Log Tab */}
            {activeInteractiveTab === 'agent' && (
              <div className="p-6 bg-[#0B0E14] font-mono text-xs space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="flex items-center gap-1.5">
                    <span>Agente:</span>
                    <ClaudeIcon className="w-4 h-4" />
                    <span>Claude 3.7 Sonnet &</span>
                    <DeepSeekIcon className="w-4 h-4" />
                    <span>DeepSeek V3 (Orquestador Dual)</span>
                  </span>
                </div>
                <div className="p-3 bg-[#111620] border border-[#202738] rounded-xl text-gray-300 space-y-1 text-[11px]">
                  <div className="text-gray-400">1. Analizando requerimientos de usuario: <span className="text-white">"Dashboard SaaS con analítica"</span></div>
                  <div className="text-blue-400">2. Generando esquema de base de datos PostgreSQL en Supabase...</div>
                  <div className="text-indigo-400">3. Construyendo componentes React modulares con Tailwind CSS...</div>
                  <div className="text-emerald-400 font-semibold">4. Verificación de TypeScript completada (0 errores). Listo para preview.</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MULTI-MODEL AI SHOWCASE SECTION
         ======================================================== */}
      <section id="modelos" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1C212D]">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
            Potencia de Próxima Generación
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Los Agentes de IA Más Avanzados del Mundo a tu Servicio
          </p>
          <p className="text-sm text-gray-400">
            No te limites a un solo modelo. Nuestro orquestador selecciona o te permite elegir el mejor motor para cada etapa del desarrollo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Claude 3.7 */}
          <div className="bg-[#121622] border border-[#242D3E] p-5 rounded-2xl hover:border-[#D97757]/50 transition-all flex flex-col justify-between space-y-4 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#D97757]/15 border border-[#D97757]/30 flex items-center justify-center text-[#D97757] shadow-sm shadow-[#D97757]/10 group-hover:scale-105 transition-transform">
                  <ClaudeIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono bg-[#D97757]/15 text-[#E07A5F] px-2 py-0.5 rounded border border-[#D97757]/30 font-semibold">
                  Razonamiento
                </span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Claude 3.7 Sonnet
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Líder en arquitectura de software compleja, refactorización de código largo y resolución de bugs difíciles.
              </p>
            </div>
            <div className="text-[11px] text-[#E07A5F]/90 font-mono pt-2 border-t border-[#1C2230] flex items-center justify-between">
              <span>Especialidad:</span>
              <span className="text-gray-300">Lógica & Refactor</span>
            </div>
          </div>

          {/* Card 2: DeepSeek V3 */}
          <div className="bg-[#121622] border border-[#242D3E] p-5 rounded-2xl hover:border-[#0E78F9]/50 transition-all flex flex-col justify-between space-y-4 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#0E78F9]/15 border border-[#0E78F9]/30 flex items-center justify-center shadow-sm shadow-[#0E78F9]/10 group-hover:scale-105 transition-transform">
                  <DeepSeekIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono bg-[#0E78F9]/15 text-blue-300 px-2 py-0.5 rounded border border-[#0E78F9]/30 font-semibold">
                  Ultra Rápido
                </span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                DeepSeek V3
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Velocidad de generación supersónica con razonamiento matemático y algorítmico de primer nivel.
              </p>
            </div>
            <div className="text-[11px] text-blue-400/90 font-mono pt-2 border-t border-[#1C2230] flex items-center justify-between">
              <span>Especialidad:</span>
              <span className="text-gray-300">Velocidad & Algoritmos</span>
            </div>
          </div>

          {/* Card 3: OpenAI GPT-4o */}
          <div className="bg-[#121622] border border-[#242D3E] p-5 rounded-2xl hover:border-[#10A37F]/50 transition-all flex flex-col justify-between space-y-4 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#10A37F]/15 border border-[#10A37F]/30 flex items-center justify-center text-[#10A37F] shadow-sm shadow-[#10A37F]/10 group-hover:scale-105 transition-transform">
                  <OpenAIIcon className="w-6 h-6" color="#10A37F" />
                </div>
                <span className="text-[10px] font-mono bg-[#10A37F]/15 text-emerald-300 px-2 py-0.5 rounded border border-[#10A37F]/30 font-semibold">
                  Multimodal
                </span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                OpenAI GPT-4o
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Comprensión visual avanzada para transformar capturas de pantalla y mockups en código Tailwind idéntico.
              </p>
            </div>
            <div className="text-[11px] text-emerald-400/90 font-mono pt-2 border-t border-[#1C2230] flex items-center justify-between">
              <span>Especialidad:</span>
              <span className="text-gray-300">Visión & UI/UX</span>
            </div>
          </div>

          {/* Card 4: Google Gemini 2.5 */}
          <div className="bg-[#121622] border border-[#242D3E] p-5 rounded-2xl hover:border-purple-500/50 transition-all flex flex-col justify-between space-y-4 group">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shadow-sm shadow-purple-500/10 group-hover:scale-105 transition-transform">
                  <GeminiIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-mono bg-purple-950/50 text-purple-300 px-2 py-0.5 rounded border border-purple-700/40 font-semibold">
                  Gran Contexto
                </span>
              </div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                Google Gemini 2.5
              </h3>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Ventana de contexto de 1 millón de tokens para analizar proyectos enteros de decenas de archivos sin olvidar nada.
              </p>
            </div>
            <div className="text-[11px] text-purple-400/90 font-mono pt-2 border-t border-[#1C2230] flex items-center justify-between">
              <span>Especialidad:</span>
              <span className="text-gray-300">Proyectos Grandes</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. CORE PLATFORM CAPABILITIES
         ======================================================== */}
      <section id="caracteristicas" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1C212D]">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
            Todo lo que Necesitas
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Diseñado para Construir Aplicaciones de Producción
          </p>
          <p className="text-sm text-gray-400">
            Olvídate de configurar herramientas, dependencias o servidores. Web AI Studio incluye el ciclo completo de software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#11151F] border border-[#212836] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Editor de Código Real con Virtual FS</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Árbol de archivos navegable, pestañas múltiples, editor interactivo y compilación al vuelo sin instalar Node.js localmente.
            </p>
          </div>

          <div className="bg-[#11151F] border border-[#212836] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Conexión Nativa Supabase</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Base de datos PostgreSQL real. Inyecta esquemas SQL, credenciales y autenticación en tus aplicaciones con un solo clic.
            </p>
          </div>

          <div className="bg-[#11151F] border border-[#212836] p-6 rounded-2xl space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">1-Clic Deploy a Vercel & GitHub</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Sincroniza directamente con tus repositorios de GitHub y publica tu aplicación en una URL pública de Vercel en segundos.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. HIGH-CONVERTING ON-PAGE REGISTRATION SECTION
         ======================================================== */}
      <section id="registro" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#1C212D]">
        <div className="bg-gradient-to-b from-[#151924] to-[#0F121A] border border-[#273042] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 blur-[90px] pointer-events-none rounded-full" />

          <div className="relative text-center max-w-xl mx-auto space-y-3 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/40 text-blue-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Registro Instantáneo • Comienza en 30 Segundos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Crea tu Cuenta y Empieza a Desarrollar
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Únete gratis para guardar tus proyectos, conectar tus cuentas de GitHub y utilizar los agentes de IA.
            </p>
          </div>

          {regSuccess ? (
            <div className="max-w-md mx-auto p-6 bg-emerald-950/40 border border-emerald-500/50 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">¡Cuenta Creada Exitosamente!</h3>
              <p className="text-xs text-gray-300">
                Iniciando entorno de desarrollo y abriendo el Studio...
              </p>
            </div>
          ) : (
            <form onSubmit={handleOnPageRegister} className="max-w-md mx-auto space-y-4">
              {regError && (
                <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ej. Sofía Morales"
                  className="w-full bg-[#0D1017] border border-[#2B3446] focus:border-blue-500 text-sm text-white px-3.5 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="sofia@ejemplo.com"
                  className="w-full bg-[#0D1017] border border-[#2B3446] focus:border-blue-500 text-sm text-white px-3.5 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full bg-[#0D1017] border border-[#2B3446] focus:border-blue-500 text-sm text-white px-3.5 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-600"
                />
              </div>

              {/* Plan Choice */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Selecciona tu Plan</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegPlan('free')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      regPlan === 'free'
                        ? 'bg-blue-950/50 border-blue-500 text-white'
                        : 'bg-[#0D1017] border-[#222A3A] text-gray-400'
                    }`}
                  >
                    <div className="text-xs font-bold">Gratis</div>
                    <div className="text-[10px] text-gray-400">$0/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegPlan('pro')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      regPlan === 'pro'
                        ? 'bg-indigo-950/50 border-indigo-500 text-white'
                        : 'bg-[#0D1017] border-[#222A3A] text-gray-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-amber-300">Pro</div>
                    <div className="text-[10px] text-gray-400">$19/mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegPlan('team')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      regPlan === 'team'
                        ? 'bg-purple-950/50 border-purple-500 text-white'
                        : 'bg-[#0D1017] border-[#222A3A] text-gray-400'
                    }`}
                  >
                    <div className="text-xs font-bold text-purple-300">Team</div>
                    <div className="text-[10px] text-gray-400">$49/mes</div>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Registrarme y Entrar al Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('free')}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  ¿Ya tienes cuenta? Iniciar Sesión
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ========================================================
          7. PRICING PLANS SECTION
         ======================================================== */}
      <section id="precios" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#1C212D]">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
            Planes y Precios
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Transparente y Escalable
          </p>
          <p className="text-sm text-gray-400">
            Comienza gratis hoy mismo y escala a medida que aumenten tus necesidades de desarrollo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Plan 1: Free */}
          <div className="bg-[#11151F] border border-[#212836] rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Starter Gratuito</h3>
                <p className="text-xs text-gray-400 mt-1">Ideal para probar la plataforma y crear tus primeras apps.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                <span className="text-xs text-gray-400">/ siempre</span>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>50 generaciones de código / día</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Previsualización interactiva instantánea</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Descarga de proyectos en .ZIP</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Acceso a DeepSeek V3 y Gemini Flash</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuthModal('free')}
              className="w-full py-2.5 rounded-xl bg-[#181D29] hover:bg-[#202737] border border-[#2B3547] text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Comenzar Gratis
            </button>
          </div>

          {/* Plan 2: Pro (Featured) */}
          <div className="bg-gradient-to-b from-[#141A29] to-[#10141F] border-2 border-blue-500 rounded-2xl p-6 flex flex-col justify-between space-y-6 relative shadow-2xl shadow-blue-500/10">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
              Más Popular
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
                  <span>Pro Creador</span>
                  <Crown className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-gray-400 mt-1">Para desarrolladores y fundadores que lanzan productos.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$19</span>
                <span className="text-xs text-gray-400">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="font-semibold text-white">Generaciones de código ilimitadas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Claude 3.7 Sonnet con razonamiento híbrido</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>1-Clic Despliegue en producción con Vercel</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Sincronización bidireccional con GitHub</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Conector de base de datos Supabase</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuthModal('pro')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
            >
              Obtener Plan Pro
            </button>
          </div>

          {/* Plan 3: Team */}
          <div className="bg-[#11151F] border border-[#212836] rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-white">Team & Scale</h3>
                <p className="text-xs text-gray-400 mt-1">Para agencias, startups y equipos de ingeniería colaborativos.</p>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$49</span>
                <span className="text-xs text-gray-400">/ mes</span>
              </div>

              <ul className="space-y-2.5 text-xs text-gray-300">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Todo lo incluido en Pro</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Hasta 5 miembros de equipo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Proyectos privados ilimitados</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Soporte prioritario y onboarding 1-a-1</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onOpenAuthModal('team')}
              className="w-full py-2.5 rounded-xl bg-[#181D29] hover:bg-[#202737] border border-[#2B3547] text-white text-xs font-semibold transition-all cursor-pointer"
            >
              Contactar para Equipos
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================
          8. FAQ SECTION
         ======================================================== */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#1C212D]">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <h2 className="text-xs font-mono uppercase tracking-widest text-blue-400 font-bold">
            Preguntas Frecuentes
          </h2>
          <p className="text-3xl font-extrabold text-white tracking-tight">
            Resolvemos tus Dudas
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#121620] border border-[#232938] rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-blue-300 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="px-4 pb-4 text-xs text-gray-300 leading-relaxed border-t border-[#1D2230] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          9. FINAL CALL TO ACTION & FOOTER
         ======================================================== */}
      <section className="py-16 px-4 text-center border-t border-[#1C212D] bg-gradient-to-b from-[#0A0C10] to-[#0F131D]">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            ¿Listo para Construir tu Próxima Gran Idea?
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Regístrate gratis o ingresa directamente a nuestro Studio interactivo.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuthModal('free')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Crear Cuenta Gratis</span>
            </button>
            <button
              onClick={() => onEnterStudio()}
              className="px-6 py-3 rounded-xl bg-[#171B26] hover:bg-[#202535] border border-[#283042] text-white font-semibold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Laptop className="w-4 h-4 text-blue-400" />
              <span>Entrar al Studio Directamente</span>
            </button>
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-[#181D28] text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-gray-400">Web AI Studio • Todos los derechos reservados.</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <a href="#caracteristicas" className="hover:text-gray-300">Términos de Servicio</a>
            <a href="#caracteristicas" className="hover:text-gray-300">Privacidad</a>
            <a href="#caracteristicas" className="hover:text-gray-300">Soporte</a>
          </div>
        </footer>
      </section>
    </div>
  );
}
