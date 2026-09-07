import { ProjectTemplate, VirtualFile } from '../types';

// ==========================================
// 1. TEMPLATE: ULTRA-INTERACTIVE LANDING PAGE
// ==========================================
const LANDING_PAGE_FILES: VirtualFile[] = [
  {
    path: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="es" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>DevNova AI — Plataforma de Desarrollo Autónomo</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            fontFamily: {
              sans: ['Plus Jakarta Sans', 'sans-serif'],
              mono: ['JetBrains Mono', 'monospace'],
            }
          }
        }
      }
    </script>
    <style>
      body { font-family: 'Plus Jakarta Sans', sans-serif; }
      pre, code { font-family: 'JetBrains Mono', monospace; }
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.05); }
      }
      .animate-glow {
        animation: pulse-slow 5s ease-in-out infinite;
      }
      /* Custom scrollbar */
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #0b0f19; }
      ::-webkit-scrollbar-thumb { background: #1f293d; border-radius: 9999px; }
      ::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
    </style>
  </head>
  <body class="bg-[#080B11] text-slate-100 min-h-screen antialiased selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
    <!-- Background Ambient Gradients -->
    <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <div class="absolute -top-40 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] animate-glow"></div>
      <div class="absolute top-1/3 -right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] animate-glow" style="animation-delay: 2s;"></div>
      <div class="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/10 rounded-full blur-[120px] animate-glow" style="animation-delay: 3.5s;"></div>
    </div>

    <!-- Main App Root -->
    <div id="app" class="relative z-10"></div>

    <!-- Canvas Confetti Overlay -->
    <canvas id="confetti-canvas" class="fixed inset-0 pointer-events-none z-50"></canvas>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
  },
  {
    path: 'src/main.js',
    language: 'javascript',
    content: `// ========================================================
// DEVNVOVA AI — LANDING PAGE ULTRA INTERACTIVA & CODE DEMOS
// ========================================================

// Estado Global de la Landing
const state = {
  activeSnippetPreset: 'saas',
  typingIndex: 0,
  isTyping: false,
  // Interactive UI Playground State
  accentColor: '#3b82f6',
  buttonRadius: 12,
  buttonText: 'Explorar Plataforma',
  glowEffect: true,
  // Pricing billing cycle
  billingPeriod: 'yearly', // 'monthly' | 'yearly'
  // Active FAQ index
  openFaq: 0,
  // Interactive Terminal state
  terminalHistory: [
    { type: 'system', text: 'DevNova CLI v3.4.1 (x86_64-cloud)' },
    { type: 'system', text: 'Escribe "help" para ver los comandos disponibles o prueba los accesos directos.' },
    { type: 'success', text: '✓ Servidor conectado a https://edge.devnova.ai' }
  ],
  terminalInput: '',
  // Live Visitors Metric
  liveCounter: 4280,
};

// Snippets de Código Interactivos por Preset
const CODE_PRESETS = {
  saas: {
    title: 'Dashboard con Métricas y Gráficos Reactivos',
    badge: 'React 18 + Tailwind',
    file: 'MetricsDashboard.tsx',
    latency: '24ms',
    code: \`import { useState, useEffect } from 'react';
import { AreaChart, MetricCard } from '@devnova/ui';

export function MetricsView() {
  const [mrr, setMrr] = useState(48250);
  const [growth, setGrowth] = useState('+28.4%');

  // Cálculo en tiempo real
  return (
    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-mono text-sm text-slate-400">Ingresos Recurrentes (MRR)</h3>
        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">{growth}</span>
      </div>
      <div className="text-3xl font-bold font-mono text-white">$\${mrr.toLocaleString()} USD</div>
      <AreaChart data={[32000, 37000, 41200, 48250]} color="#3b82f6" />
    </div>
  );
}\`
  },
  auth: {
    title: 'Flujo de Autenticación con Row Level Security',
    badge: 'Supabase + Edge Functions',
    file: 'authMiddleware.ts',
    latency: '18ms',
    code: \`import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.ANON_KEY);

export async function verifyUserSession(token: string) {
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (error || !user) throw new Error('Acceso no autorizado');

  // Encriptación AES-GCM en el Edge Worker
  const tenantAccess = await verifyRLS(user.id, 'tenant_enterprise');
  return { userId: user.id, role: tenantAccess.role, status: 'authenticated' };
}\`
  },
  ai: {
    title: 'Pipeline de Generación y Streaming de Código con Gemini',
    badge: 'Antigravity LLM Agent',
    file: 'generatorPipeline.ts',
    latency: '41ms',
    code: \`import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function streamFullstackApp(prompt: string, onChunk: (c: string) => void) {
  const responseStream = await ai.models.generateContentStream({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: { temperature: 0.2, systemInstruction: 'Genera código production-ready en TypeScript' }
  });

  for await (const chunk of responseStream) {
    onChunk(chunk.text);
  }
}\`
  },
  ecommerce: {
    title: 'Carrito Reactivo con Checkout Seguro',
    badge: 'Stripe + React Virtualized',
    file: 'CartEngine.ts',
    latency: '30ms',
    code: \`export class ShoppingCartEngine {
  private items: Map<string, CartItem> = new Map();

  addItem(product: Product, quantity = 1) {
    const existing = this.items.get(product.id);
    this.items.set(product.id, { ...product, qty: (existing?.qty || 0) + quantity });
    this.emitChange();
  }

  get totalAmount() {
    return Array.from(this.items.values()).reduce((sum, item) => sum + (item.price * item.qty), 0);
  }
}\`
  }
};

// Renderizado de toda la aplicación
function renderApp() {
  const root = document.getElementById('app');
  if (!root) return;

  const activeSnippet = CODE_PRESETS[state.activeSnippetPreset];

  root.innerHTML = \`
    <!-- Navigation Bar -->
    <header class="sticky top-0 z-40 border-b border-slate-800/80 bg-[#080B11]/80 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/25 border border-blue-400/30">
            N
          </div>
          <div class="flex flex-col">
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-lg tracking-tight text-white font-mono">DevNova</span>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30 font-mono">v3.4</span>
            </div>
          </div>
        </div>

        <nav class="hidden md:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <a href="#code-engine" class="hover:text-white transition-colors">Motor de Código</a>
          <a href="#playground" class="hover:text-white transition-colors">Playground</a>
          <a href="#terminal-section" class="hover:text-white transition-colors">Terminal CLI</a>
          <a href="#pricing" class="hover:text-white transition-colors">Precios</a>
          <a href="#faq" class="hover:text-white transition-colors">FAQ</a>
        </nav>

        <div class="flex items-center gap-3">
          <button id="btn-demo-confetti" class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all">
            <span>🎉 Disparar Demo</span>
          </button>
          <a href="#playground" class="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-600/30 border border-blue-400/30 transition-all">
            <span>Comenzar Ahora</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    </header>

    <!-- HERO SECTION -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-16 relative">
      <div class="text-center max-w-3xl mx-auto mb-12">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-6 shadow-inner">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span>Nueva Generación: Motor de IA con Compilación en 30ms</span>
        </div>

        <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
          De idea a código funcional en <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">segundos</span>, sin simulaciones.
        </h1>

        <p class="text-slate-400 text-base sm:text-lg leading-relaxed mb-8">
          La plataforma autónoma para desarrolladores que genera arquitecturas completas, ejecuta pruebas en tiempo real y despliega aplicaciones reales a producción con un solo clic.
        </p>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <button id="btn-hero-start" class="px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/30 border border-blue-400/40 transition-all flex items-center gap-2">
            <span>🚀 Probar Generador Interactivo</span>
          </button>
          <a href="#code-engine" class="px-6 py-3.5 rounded-xl font-bold text-sm text-slate-300 bg-slate-900/80 hover:bg-slate-800 hover:text-white border border-slate-800 transition-all flex items-center gap-2">
            <span>Ver Códigos en Vivo</span>
            <span>&darr;</span>
          </a>
        </div>

        <div class="mt-8 flex items-center justify-center gap-6 text-xs text-slate-400 font-mono">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>TypeScript 5.x Nativo</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Vite + Tailwind V4</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Zero Simulación</span>
          </div>
        </div>
      </div>

      <!-- INTERACTIVE CODE ENGINE VISUALIZER -->
      <div id="code-engine" class="scroll-mt-24 max-w-5xl mx-auto rounded-2xl bg-[#0B0F19] border border-slate-800 shadow-2xl overflow-hidden">
        <!-- Window Chrome / Header -->
        <div class="h-12 bg-[#0E1321] border-b border-slate-800/80 px-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
            <span class="text-xs font-mono text-slate-400 ml-2">\${activeSnippet.file}</span>
            <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">\${activeSnippet.badge}</span>
          </div>

          <div class="flex items-center gap-3 text-xs font-mono">
            <span class="text-slate-400 flex items-center gap-1.5">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Latencia: <strong class="text-white">\${activeSnippet.latency}</strong>
            </span>
            <button id="btn-copy-code" class="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all text-xs font-sans">
              Copiar Código
            </button>
          </div>
        </div>

        <!-- Preset Tabs (Clickable) -->
        <div class="flex items-center gap-1 p-2 bg-[#0A0D17] border-b border-slate-800/80 overflow-x-auto text-xs font-medium">
          <span class="text-slate-500 px-3 text-[11px] font-mono uppercase tracking-wider">Módulos:</span>
          
          <button data-preset="saas" class="btn-preset px-3 py-1.5 rounded-lg font-mono transition-all flex items-center gap-2 \${state.activeSnippetPreset === 'saas' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}">
            <span>📊 SaaS Metrics</span>
          </button>
          
          <button data-preset="auth" class="btn-preset px-3 py-1.5 rounded-lg font-mono transition-all flex items-center gap-2 \${state.activeSnippetPreset === 'auth' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}">
            <span>🔐 Supabase Auth</span>
          </button>

          <button data-preset="ai" class="btn-preset px-3 py-1.5 rounded-lg font-mono transition-all flex items-center gap-2 \${state.activeSnippetPreset === 'ai' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}">
            <span>🤖 AI Pipeline</span>
          </button>

          <button data-preset="ecommerce" class="btn-preset px-3 py-1.5 rounded-lg font-mono transition-all flex items-center gap-2 \${state.activeSnippetPreset === 'ecommerce' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'}">
            <span>🛒 E-Commerce Cart</span>
          </button>
        </div>

        <!-- Code Block View -->
        <div class="p-4 sm:p-6 overflow-x-auto bg-[#07090F]">
          <pre class="text-xs sm:text-sm font-mono text-slate-300 leading-relaxed"><code id="code-content">\${escapeHtml(activeSnippet.code)}</code></pre>
        </div>

        <!-- Terminal Status Bar -->
        <div class="h-9 bg-[#0E1321] border-t border-slate-800/80 px-4 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div class="flex items-center gap-2">
            <span class="text-emerald-400">✓ Compilación 100% exitosa</span>
            <span class="text-slate-600">|</span>
            <span>TypeScript Typecheck Passed</span>
          </div>
          <div>
            <span>Modo Reactivo: <strong>HMR Activo</strong></span>
          </div>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE UI PLAYGROUND SECTION -->
    <section id="playground" class="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">Caja de Experimentos</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Playground de Componentes en Vivo</h2>
        <p class="text-slate-400 text-sm mt-2">
          Ajusta los parámetros visuales y observa cómo el código y el componente se adaptan en tiempo real.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-5xl mx-auto items-stretch">
        <!-- Controls Panel (Left) -->
        <div class="lg:col-span-5 bg-[#0B0F19] border border-slate-800 p-6 rounded-2xl flex flex-col justify-between shadow-xl">
          <div class="space-y-5">
            <h3 class="text-sm font-bold text-white font-mono flex items-center gap-2 border-b border-slate-800 pb-3">
              <span>⚙️ Parámetros del Componente</span>
            </h3>

            <!-- Text Input -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-1.5">Texto del Botón:</label>
              <input
                id="input-btn-text"
                type="text"
                value="\${state.buttonText}"
                class="w-full bg-[#121622] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <!-- Color Palette Radios -->
            <div>
              <label class="block text-xs font-medium text-slate-300 mb-2">Color de Acento:</label>
              <div class="flex items-center gap-3">
                <button data-color="#3b82f6" class="btn-color-accent w-8 h-8 rounded-full bg-blue-500 transition-transform \${state.accentColor === '#3b82f6' ? 'ring-2 ring-white scale-110' : ''}" title="Azul"></button>
                <button data-color="#10b981" class="btn-color-accent w-8 h-8 rounded-full bg-emerald-500 transition-transform \${state.accentColor === '#10b981' ? 'ring-2 ring-white scale-110' : ''}" title="Esmeralda"></button>
                <button data-color="#8b5cf6" class="btn-color-accent w-8 h-8 rounded-full bg-purple-500 transition-transform \${state.accentColor === '#8b5cf6' ? 'ring-2 ring-white scale-110' : ''}" title="Púrpura"></button>
                <button data-color="#f59e0b" class="btn-color-accent w-8 h-8 rounded-full bg-amber-500 transition-transform \${state.accentColor === '#f59e0b' ? 'ring-2 ring-white scale-110' : ''}" title="Ámbar"></button>
                <button data-color="#ec4899" class="btn-color-accent w-8 h-8 rounded-full bg-pink-500 transition-transform \${state.accentColor === '#ec4899' ? 'ring-2 ring-white scale-110' : ''}" title="Rosa"></button>
              </div>
            </div>

            <!-- Border Radius Slider -->
            <div>
              <div class="flex items-center justify-between text-xs text-slate-300 mb-1.5">
                <span>Radio de Borde:</span>
                <span id="label-radius" class="font-mono text-blue-400">\${state.buttonRadius}px</span>
              </div>
              <input
                id="slider-radius"
                type="range"
                min="0"
                max="32"
                value="\${state.buttonRadius}"
                class="w-full accent-blue-500 cursor-pointer"
              />
            </div>

            <!-- Glow Effect Toggle -->
            <div class="flex items-center justify-between pt-2">
              <span class="text-xs text-slate-300">Efecto Resplandor Neón:</span>
              <button
                id="toggle-glow"
                class="w-11 h-6 rounded-full transition-colors relative \${state.glowEffect ? 'bg-blue-600' : 'bg-slate-700'}"
              >
                <span class="block w-4 h-4 rounded-full bg-white transition-transform transform \${state.glowEffect ? 'translate-x-6' : 'translate-x-1'}"></span>
              </button>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Estado: <strong>Reactivo</strong></span>
            <button id="btn-reset-playground" class="text-blue-400 hover:text-blue-300 underline">Reiniciar valores</button>
          </div>
        </div>

        <!-- Preview & Generated Code (Right) -->
        <div class="lg:col-span-7 flex flex-col gap-4">
          <!-- Live Preview Canvas Box -->
          <div class="bg-[#0B0F19] border border-slate-800 p-8 rounded-2xl flex flex-col items-center justify-center min-h-[190px] shadow-xl relative overflow-hidden">
            <div class="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
            
            <!-- The Reactive Dynamic Button -->
            <button
              id="live-playground-btn"
              style="
                background-color: \${state.accentColor};
                border-radius: \${state.buttonRadius}px;
                box-shadow: \${state.glowEffect ? \`0 10px 25px -5px \${state.accentColor}80\` : 'none'};
              "
              class="px-8 py-3.5 text-white font-bold text-sm tracking-wide transition-all transform active:scale-95 cursor-pointer hover:opacity-95"
            >
              \${state.buttonText}
            </button>

            <span class="text-[11px] text-slate-500 mt-4 font-mono">Haz clic en el botón para probar la animación interactiva</span>
          </div>

          <!-- Live Generated JSX / Tailwind Code Snippet -->
          <div class="bg-[#080A10] border border-slate-800/80 rounded-2xl p-4 flex-1">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono text-slate-400">Código Generado React + Tailwind:</span>
              <button id="btn-copy-playground-code" class="text-xs text-blue-400 hover:text-blue-300 font-mono">
                Copiar JSX
              </button>
            </div>
            <pre class="text-xs font-mono text-emerald-400 bg-[#05070A] p-3 rounded-xl overflow-x-auto leading-relaxed border border-slate-900"><code id="code-playground-output">&lt;button
  className="px-8 py-3.5 text-white font-bold text-sm transition-all"
  style={{
    backgroundColor: '\${state.accentColor}',
    borderRadius: '\${state.buttonRadius}px',
    boxShadow: '\${state.glowEffect ? \`0 10px 25px -5px \${state.accentColor}80\` : 'none'}'
  }}
&gt;
  \${state.buttonText}
&lt;/button&gt;</code></pre>
          </div>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE CLI TERMINAL DEMO -->
    <section id="terminal-section" class="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
      <div class="text-center max-w-2xl mx-auto mb-12">
        <span class="text-xs font-mono font-semibold uppercase tracking-wider text-purple-400">Terminal Integrada</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Simulador de Consola CLI</h2>
        <p class="text-slate-400 text-sm mt-2">
          Escribe comandos reales como <code class="text-blue-400">deploy</code>, <code class="text-blue-400">status</code> o <code class="text-blue-400">test</code> directamente en la terminal.
        </p>
      </div>

      <div class="max-w-3xl mx-auto bg-[#0A0D15] border border-slate-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-xs">
        <!-- Terminal Top Bar -->
        <div class="h-10 bg-[#0F1420] border-b border-slate-800 px-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-rose-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-amber-500/80"></span>
            <span class="w-3 h-3 rounded-full bg-emerald-500/80"></span>
            <span class="text-slate-400 text-xs ml-2">bash ~ devnova-cli</span>
          </div>

          <!-- Quick Command Shortcuts -->
          <div class="flex items-center gap-1.5">
            <button data-cmd="deploy" class="btn-quick-cmd px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]">deploy</button>
            <button data-cmd="status" class="btn-quick-cmd px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]">status</button>
            <button data-cmd="test" class="btn-quick-cmd px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]">test</button>
            <button data-cmd="clear" class="btn-quick-cmd px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]">clear</button>
          </div>
        </div>

        <!-- Terminal Output Stream -->
        <div id="terminal-screen" class="p-4 h-64 overflow-y-auto space-y-1.5 bg-[#07090F] text-slate-300">
          \${state.terminalHistory.map(entry => {
            if (entry.type === 'user') {
              return \`<div class="flex items-center gap-2 text-blue-400 font-bold">
                <span>$</span>
                <span class="text-white">\${escapeHtml(entry.text)}</span>
              </div>\`;
            }
            if (entry.type === 'success') {
              return \`<div class="text-emerald-400 leading-relaxed">\${escapeHtml(entry.text)}</div>\`;
            }
            if (entry.type === 'error') {
              return \`<div class="text-rose-400 leading-relaxed">\${escapeHtml(entry.text)}</div>\`;
            }
            return \`<div class="text-slate-400 leading-relaxed">\${escapeHtml(entry.text)}</div>\`;
          }).join('')}
        </div>

        <!-- Terminal Command Input Bar -->
        <form id="terminal-form" class="h-11 bg-[#0D111C] border-t border-slate-800 px-4 flex items-center gap-2">
          <span class="text-emerald-400 font-bold">$</span>
          <input
            id="terminal-input"
            type="text"
            placeholder="Escribe 'help', 'deploy', 'status' o 'clear'..."
            class="flex-1 bg-transparent border-0 text-white text-xs font-mono focus:outline-none placeholder-slate-600"
            autocomplete="off"
          />
          <button type="submit" class="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-sans font-semibold">
            Ejecutar
          </button>
        </form>
      </div>
    </section>

    <!-- INTERACTIVE PRICING SECTION -->
    <section id="pricing" class="scroll-mt-24 max-w-7xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
      <div class="text-center max-w-2xl mx-auto mb-10">
        <span class="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">Planes Transparentes</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Escala sin sorpresas de factura</h2>
        
        <!-- Monthly / Yearly Interactive Toggle -->
        <div class="mt-6 inline-flex items-center bg-[#0B0F19] p-1 rounded-xl border border-slate-800">
          <button
            id="toggle-monthly"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all \${state.billingPeriod === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
          >
            Facturación Mensual
          </button>
          <button
            id="toggle-yearly"
            class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 \${state.billingPeriod === 'yearly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
          >
            <span>Anual (-20%)</span>
            <span class="px-1.5 py-0.2 rounded text-[9px] bg-emerald-500/20 text-emerald-400 font-bold">Ahorro</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        <!-- Tier 1: Starter -->
        <div class="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <h3 class="text-lg font-bold text-white">Starter</h3>
            <p class="text-xs text-slate-400 mt-1">Para prototipos rápidos y proyectos personales.</p>
            <div class="my-6">
              <span class="text-4xl font-extrabold text-white font-mono">$0</span>
              <span class="text-xs text-slate-400 font-mono"> / siempre gratis</span>
            </div>
            <ul class="space-y-2.5 text-xs text-slate-300">
              <li class="flex items-center gap-2">✓ 3 proyectos activos</li>
              <li class="flex items-center gap-2">✓ Generador con Gemini 2.5</li>
              <li class="flex items-center gap-2">✓ Exportación a ZIP completa</li>
              <li class="flex items-center gap-2">✓ Vista previa interactiva</li>
            </ul>
          </div>
          <button class="btn-choose-plan mt-8 w-full py-2.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold transition-colors">
            Crear Cuenta Gratis
          </button>
        </div>

        <!-- Tier 2: Pro (Highlighted) -->
        <div class="p-6 rounded-2xl bg-gradient-to-b from-[#111626] to-[#0A0D15] border-2 border-blue-500/60 shadow-2xl shadow-blue-500/10 flex flex-col justify-between relative transform md:-translate-y-2">
          <div class="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold tracking-wider uppercase shadow-md">
            Más Popular
          </div>
          <div>
            <h3 class="text-lg font-bold text-white">Pro Engineer</h3>
            <p class="text-xs text-slate-400 mt-1">Para desarrolladores que construyen apps reales a diario.</p>
            <div class="my-6">
              <span class="text-4xl font-extrabold text-white font-mono" id="price-pro">\${state.billingPeriod === 'yearly' ? '$19' : '$24'}</span>
              <span class="text-xs text-slate-400 font-mono"> / mes</span>
            </div>
            <ul class="space-y-2.5 text-xs text-slate-200 font-medium">
              <li class="flex items-center gap-2 text-blue-400">✓ Proyectos ilimitados</li>
              <li class="flex items-center gap-2 text-blue-400">✓ Integración directa con GitHub & Vercel</li>
              <li class="flex items-center gap-2 text-blue-400">✓ Conexión automática con Supabase RLS</li>
              <li class="flex items-center gap-2 text-blue-400">✓ Motor Antigravity AI sin límites</li>
            </ul>
          </div>
          <button class="btn-choose-plan mt-8 w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all">
            Empezar Prueba de 14 Días
          </button>
        </div>

        <!-- Tier 3: Enterprise -->
        <div class="p-6 rounded-2xl bg-[#0B0F19] border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all">
          <div>
            <h3 class="text-lg font-bold text-white">Enterprise Team</h3>
            <p class="text-xs text-slate-400 mt-1">Para agencias de software y equipos de alta escala.</p>
            <div class="my-6">
              <span class="text-4xl font-extrabold text-white font-mono" id="price-ent">\${state.billingPeriod === 'yearly' ? '$79' : '$99'}</span>
              <span class="text-xs text-slate-400 font-mono"> / mes</span>
            </div>
            <ul class="space-y-2.5 text-xs text-slate-300">
              <li class="flex items-center gap-2">✓ Todo lo de Pro ilimitado</li>
              <li class="flex items-center gap-2">✓ LLM Privado dedicado (On-Prem / Cloud)</li>
              <li class="flex items-center gap-2">✓ Soporte 24/7 y SLA garantizado</li>
              <li class="flex items-center gap-2">✓ SSO & Auditoría de código</li>
            </ul>
          </div>
          <button class="btn-choose-plan mt-8 w-full py-2.5 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-bold transition-colors">
            Contactar Ventas
          </button>
        </div>
      </div>
    </section>

    <!-- INTERACTIVE FAQ SECTION -->
    <section id="faq" class="scroll-mt-24 max-w-4xl mx-auto px-4 sm:px-6 py-16 border-t border-slate-800/80">
      <div class="text-center mb-10">
        <span class="text-xs font-mono font-semibold uppercase tracking-wider text-blue-400">Preguntas Frecuentes</span>
        <h2 class="text-3xl font-extrabold text-white mt-1">Respuestas a tus dudas</h2>
      </div>

      <div class="space-y-3">
        \${[
          {
            q: '¿El código generado es realmente funcional o son solo maquetas?',
            a: 'El código generado es 100% ejecutable, modular y preparado para producción con TypeScript, Tailwind y bundler en tiempo real. Puedes descargarlo en ZIP y correrlo en tu máquina con "npm install && npm run dev".'
          },
          {
            q: '¿Puedo conectar mis repositorios reales de GitHub y desplegar a Vercel?',
            a: 'Sí, la suite cuenta con integraciones nativas de OAuth para GitHub y Vercel. Puedes clonar repositorios, crear ramas y desplegar en servidores Cloud de producción al instante.'
          },
          {
            q: '¿Qué modelos de Inteligencia Artificial utilizan?',
            a: 'Utilizamos los modelos Gemini 2.5 y modelos Antigravity configurados específicamente para ingeniería de software con arquitectura basada en agentes sin estados alucinados.'
          }
        ].map((item, idx) => \`
          <div class="border border-slate-800 rounded-xl bg-[#0B0F19] overflow-hidden transition-colors">
            <button data-faq="\${idx}" class="btn-faq w-full px-5 py-4 flex items-center justify-between text-left text-sm font-semibold text-slate-200 hover:text-white">
              <span>\${item.q}</span>
              <span class="text-blue-400 font-mono text-base transform transition-transform \${state.openFaq === idx ? 'rotate-180' : ''}">▾</span>
            </button>
            \${state.openFaq === idx ? \`
              <div class="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                \${item.a}
              </div>
            \` : ''}
          </div>
        \`).join('')}
      </div>
    </section>

    <!-- FOOTER WITH CONFETTI CTA -->
    <footer class="border-t border-slate-800/80 bg-[#06080E] py-12 text-center text-xs text-slate-500 font-mono">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2 text-slate-400 font-sans">
          <div class="w-6 h-6 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-xs">N</div>
          <span class="font-bold text-white">DevNova Studio</span> &copy; 2026. Todos los derechos reservados.
        </div>
        <div class="flex items-center gap-6">
          <button id="btn-footer-confetti" class="hover:text-blue-400 text-slate-400 transition-colors">🎊 Lanzar Confeti</button>
          <a href="#app" class="hover:text-white transition-colors">Volver arriba &uarr;</a>
        </div>
      </div>
    </footer>
  \`;

  // Attach all interactive event listeners
  attachEvents();
}

// Attach Interactive Listeners
function attachEvents() {
  // Preset Snippet Buttons
  document.querySelectorAll('.btn-preset').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preset = btn.getAttribute('data-preset');
      if (preset && CODE_PRESETS[preset]) {
        state.activeSnippetPreset = preset;
        renderApp();
      }
    });
  });

  // Copy Code Button
  const btnCopy = document.getElementById('btn-copy-code');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      const code = CODE_PRESETS[state.activeSnippetPreset].code;
      navigator.clipboard.writeText(code);
      btnCopy.innerText = '✓ ¡Copiado!';
      btnCopy.classList.add('text-emerald-400');
      setTimeout(() => {
        btnCopy.innerText = 'Copiar Código';
        btnCopy.classList.remove('text-emerald-400');
      }, 2000);
    });
  }

  // Playground Text Input
  const inputBtnText = document.getElementById('input-btn-text');
  if (inputBtnText) {
    inputBtnText.addEventListener('input', (e) => {
      state.buttonText = e.target.value || 'Botón';
      updatePlaygroundPreview();
    });
  }

  // Playground Color Buttons
  document.querySelectorAll('.btn-color-accent').forEach(btn => {
    btn.addEventListener('click', () => {
      state.accentColor = btn.getAttribute('data-color') || '#3b82f6';
      renderApp();
    });
  });

  // Playground Radius Slider
  const sliderRadius = document.getElementById('slider-radius');
  if (sliderRadius) {
    sliderRadius.addEventListener('input', (e) => {
      state.buttonRadius = parseInt(e.target.value, 10);
      const label = document.getElementById('label-radius');
      if (label) label.innerText = \`\${state.buttonRadius}px\`;
      updatePlaygroundPreview();
    });
  }

  // Playground Glow Toggle
  const toggleGlow = document.getElementById('toggle-glow');
  if (toggleGlow) {
    toggleGlow.addEventListener('click', () => {
      state.glowEffect = !state.glowEffect;
      renderApp();
    });
  }

  // Reset Playground
  const btnReset = document.getElementById('btn-reset-playground');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      state.accentColor = '#3b82f6';
      state.buttonRadius = 12;
      state.buttonText = 'Explorar Plataforma';
      state.glowEffect = true;
      renderApp();
    });
  }

  // Live Playground Button Click (Interactive Feedback)
  const liveBtn = document.getElementById('live-playground-btn');
  if (liveBtn) {
    liveBtn.addEventListener('click', () => {
      fireConfetti();
      liveBtn.classList.add('scale-110');
      setTimeout(() => liveBtn.classList.remove('scale-110'), 250);
    });
  }

  // Copy Playground Code
  const btnCopyPlayground = document.getElementById('btn-copy-playground-code');
  if (btnCopyPlayground) {
    btnCopyPlayground.addEventListener('click', () => {
      const codeOutput = document.getElementById('code-playground-output');
      if (codeOutput) {
        navigator.clipboard.writeText(codeOutput.innerText);
        btnCopyPlayground.innerText = '✓ ¡Copiado!';
        setTimeout(() => (btnCopyPlayground.innerText = 'Copiar JSX'), 2000);
      }
    });
  }

  // Quick Command Buttons in Terminal
  document.querySelectorAll('.btn-quick-cmd').forEach(btn => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) executeTerminalCommand(cmd);
    });
  });

  // Terminal Form Submit
  const termForm = document.getElementById('terminal-form');
  if (termForm) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('terminal-input');
      if (input && input.value.trim()) {
        const cmd = input.value.trim();
        input.value = '';
        executeTerminalCommand(cmd);
      }
    });
  }

  // Monthly / Yearly Toggles
  const toggleMonthly = document.getElementById('toggle-monthly');
  const toggleYearly = document.getElementById('toggle-yearly');
  if (toggleMonthly && toggleYearly) {
    toggleMonthly.addEventListener('click', () => {
      state.billingPeriod = 'monthly';
      renderApp();
    });
    toggleYearly.addEventListener('click', () => {
      state.billingPeriod = 'yearly';
      renderApp();
    });
  }

  // FAQ Accordion Buttons
  document.querySelectorAll('.btn-faq').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-faq'), 10);
      state.openFaq = state.openFaq === idx ? -1 : idx;
      renderApp();
    });
  });

  // Confetti Buttons
  const btnDemoConfetti = document.getElementById('btn-demo-confetti');
  const btnHeroStart = document.getElementById('btn-hero-start');
  const btnFooterConfetti = document.getElementById('btn-footer-confetti');
  [btnDemoConfetti, btnHeroStart, btnFooterConfetti].forEach(btn => {
    if (btn) btn.addEventListener('click', () => fireConfetti());
  });

  document.querySelectorAll('.btn-choose-plan').forEach(btn => {
    btn.addEventListener('click', () => {
      fireConfetti();
      alert('¡Excelente elección! La plataforma activó tu entorno en tiempo real.');
    });
  });
}

// Update playground visual button without re-rendering entire DOM
function updatePlaygroundPreview() {
  const liveBtn = document.getElementById('live-playground-btn');
  const codeOutput = document.getElementById('code-playground-output');

  if (liveBtn) {
    liveBtn.innerText = state.buttonText;
    liveBtn.style.backgroundColor = state.accentColor;
    liveBtn.style.borderRadius = \`\${state.buttonRadius}px\`;
    liveBtn.style.boxShadow = state.glowEffect ? \`0 10px 25px -5px \${state.accentColor}80\` : 'none';
  }

  if (codeOutput) {
    codeOutput.innerText = \`<button
  className="px-8 py-3.5 text-white font-bold text-sm transition-all"
  style={{
    backgroundColor: '\${state.accentColor}',
    borderRadius: '\${state.buttonRadius}px',
    boxShadow: '\${state.glowEffect ? \`0 10px 25px -5px \${state.accentColor}80\` : 'none'}'
  }}
>
  \${state.buttonText}
</button>\`;
  }
}

// Interactive Terminal Command Execution
function executeTerminalCommand(cmd) {
  const cleanCmd = cmd.toLowerCase().trim();
  state.terminalHistory.push({ type: 'user', text: cleanCmd });

  if (cleanCmd === 'clear') {
    state.terminalHistory = [];
  } else if (cleanCmd === 'help') {
    state.terminalHistory.push({
      type: 'system',
      text: 'Comandos disponibles: deploy, status, test, build, matrix, clear, whoami, ping'
    });
  } else if (cleanCmd === 'deploy') {
    state.terminalHistory.push({ type: 'system', text: 'Iniciando empaquetado de assets...' });
    state.terminalHistory.push({ type: 'system', text: 'Subiendo artefactos a Vercel Edge Network...' });
    state.terminalHistory.push({ type: 'success', text: '✓ ¡Despliegue activo en: https://devnova-app.vercel.app!' });
  } else if (cleanCmd === 'status') {
    state.terminalHistory.push({ type: 'success', text: '● Uptime: 99.98% | CPU: 12% | Memoria: 184MB/1024MB | 0 errores' });
  } else if (cleanCmd === 'test') {
    state.terminalHistory.push({ type: 'system', text: 'Ejecutando suite de pruebas automatizadas...' });
    state.terminalHistory.push({ type: 'success', text: '✓ 42 pruebas pasadas (0 fallidas) en 142ms' });
  } else if (cleanCmd === 'matrix') {
    state.terminalHistory.push({ type: 'success', text: 'Wake up, Neo... The Matrix has you.' });
  } else if (cleanCmd === 'whoami') {
    state.terminalHistory.push({ type: 'system', text: 'DevNova Architect v3 (rubenfiverr612)' });
  } else if (cleanCmd === 'ping') {
    state.terminalHistory.push({ type: 'success', text: 'PONG: 14ms al edge server' });
  } else {
    state.terminalHistory.push({
      type: 'error',
      text: \`Comando no reconocido: "\${cleanCmd}". Escribe "help" para ver la lista.\`
    });
  }

  renderApp();

  // Scroll to bottom of terminal
  setTimeout(() => {
    const termScreen = document.getElementById('terminal-screen');
    if (termScreen) termScreen.scrollTop = termScreen.scrollHeight;
  }, 50);
}

// Simple Confetti Animation on Canvas
function fireConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#38bdf8'];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.8) * 16,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 10
    });
  }

  let animationFrame;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.alpha -= 0.015;
      p.rotation += p.vRotation;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  animate();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Inicializar la aplicación
renderApp();
`
  }
];

// ==========================================
// 2. TEMPLATE: SAAS DASHBOARD (CLOUDPULSE)
// ==========================================
const SAAS_DASHBOARD_FILES: VirtualFile[] = [
  {
    path: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CloudPulse SaaS Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
  </head>
  <body class="bg-slate-950 text-slate-100 min-h-screen antialiased">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
  },
  {
    path: 'src/main.js',
    language: 'javascript',
    content: `let state = {
  activeTab: 'metrics',
  tasks: [
    { id: 1, title: 'Conectar flujo OAuth con GitHub', status: 'completed', tag: 'Dev' },
    { id: 2, title: 'Configurar Webhook de despliegue en Vercel', status: 'completed', tag: 'DevOps' },
    { id: 3, title: 'Sincronizar tablas RLS en Supabase', status: 'in-progress', tag: 'Database' },
    { id: 4, title: 'Generador de arquitectura con Gemini AI', status: 'in-progress', tag: 'AI' }
  ],
  stats: {
    activeUsers: '14,820',
    deployments: '342',
    syncedRepos: '98.4%'
  }
};

function render() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = \`
    <header class="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
            ⚡
          </div>
          <span class="font-bold text-lg tracking-tight text-white">CloudPulse Studio</span>
          <span class="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">En Línea</span>
        </div>

        <nav class="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
          <button id="tab-metrics" class="px-3 py-1.5 rounded-lg text-xs font-semibold \${state.activeTab === 'metrics' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}">Métricas</button>
          <button id="tab-tasks" class="px-3 py-1.5 rounded-lg text-xs font-semibold \${state.activeTab === 'tasks' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}">Tareas</button>
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      \${state.activeTab === 'metrics' ? renderMetrics() : renderTasks()}
    </main>
  \`;

  document.getElementById('tab-metrics')?.addEventListener('click', () => { state.activeTab = 'metrics'; render(); });
  document.getElementById('tab-tasks')?.addEventListener('click', () => { state.activeTab = 'tasks'; render(); });
}

function renderMetrics() {
  return \`
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div class="text-xs font-medium text-slate-400 mb-1">Usuarios Activos</div>
        <div class="text-3xl font-extrabold text-white">\${state.stats.activeUsers}</div>
        <div class="text-xs text-emerald-400 mt-2 font-medium">↑ +18.2% este mes</div>
      </div>
      <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div class="text-xs font-medium text-slate-400 mb-1">Despliegues en Producción</div>
        <div class="text-3xl font-extrabold text-white">\${state.stats.deployments}</div>
        <div class="text-xs text-blue-400 mt-2 font-medium">100% automatizados</div>
      </div>
      <div class="p-6 rounded-2xl bg-slate-900/50 border border-slate-800">
        <div class="text-xs font-medium text-slate-400 mb-1">Sincronización Repos</div>
        <div class="text-3xl font-extrabold text-white">\${state.stats.syncedRepos}</div>
        <div class="text-xs text-emerald-400 mt-2 font-medium">Latencia 12ms</div>
      </div>
    </div>
  \`;
}

function renderTasks() {
  return \`
    <div class="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
      <h2 class="text-lg font-bold text-white mb-4">Pipeline de Desarrollo</h2>
      <div class="space-y-3">
        \${state.tasks.map(t => \`
          <div class="flex items-center justify-between p-3.5 bg-slate-800/40 rounded-xl border border-slate-800">
            <span class="text-sm font-medium text-slate-200">\${t.title}</span>
            <span class="px-2.5 py-1 text-xs rounded-full \${t.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'} font-semibold">\${t.status}</span>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;
}

render();
`
  }
];

// ==========================================
// 3. TEMPLATE: E-COMMERCE MODERNO
// ==========================================
const ECOMMERCE_FILES: VirtualFile[] = [
  {
    path: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CyberKicks — Tienda de Zapatillas y Moda Futurista</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
  </head>
  <body class="bg-[#0D1017] text-slate-100 min-h-screen antialiased">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
  },
  {
    path: 'src/main.js',
    language: 'javascript',
    content: `const state = {
  cart: [],
  products: [
    { id: 1, name: 'CyberPulse X1', price: 180, category: 'Futurista', image: '👟', rating: '4.9' },
    { id: 2, name: 'Neon Glide Pro', price: 210, category: 'Running', image: '⚡', rating: '5.0' },
    { id: 3, name: 'Quantum Stealth', price: 165, category: 'Urbano', image: '🕶️', rating: '4.8' },
    { id: 4, name: 'Matrix Drift', price: 240, category: 'Edición Especial', image: '🚀', rating: '4.95' }
  ],
  isCartOpen: false
};

function render() {
  const root = document.getElementById('app');
  if (!root) return;

  const totalItems = state.cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);

  root.innerHTML = \`
    <header class="h-16 border-b border-slate-800 bg-[#121622] px-6 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-2">
        <span class="text-2xl">⚡</span>
        <span class="font-extrabold text-lg text-white tracking-tight">CYBERKICKS</span>
      </div>

      <button id="btn-toggle-cart" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md">
        <span>🛒 Carrito</span>
        <span class="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono">\${totalItems}</span>
      </button>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-10">
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold text-white">Colección de Edición Limitada</h1>
        <p class="text-slate-400 text-sm mt-1">Diseñadas para máxima durabilidad y velocidad urbana.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        \${state.products.map(p => \`
          <div class="p-5 rounded-2xl bg-[#141824] border border-slate-800 flex flex-col justify-between hover:border-blue-500/50 transition-all">
            <div class="text-5xl text-center py-6 bg-[#0E111A] rounded-xl mb-4 select-none">\${p.image}</div>
            <div>
              <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">\${p.category}</span>
              <h3 class="font-bold text-white text-base mt-1">\${p.name}</h3>
              <div class="flex items-center justify-between mt-3 mb-4">
                <span class="text-xl font-extrabold font-mono text-white">\$\${p.price}</span>
                <span class="text-xs text-amber-400 font-semibold">★ \${p.rating}</span>
              </div>
            </div>
            <button data-add="\${p.id}" class="btn-add-product w-full py-2.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all">
              Añadir al Carrito
            </button>
          </div>
        \`).join('')}
      </div>
    </main>

    <!-- Slide-over Cart Modal -->
    \${state.isCartOpen ? \`
      <div class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-end">
        <div class="w-full max-w-md bg-[#121622] h-full p-6 flex flex-col justify-between border-l border-slate-800">
          <div>
            <div class="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 class="text-lg font-bold text-white">Tu Carrito (\${totalItems})</h2>
              <button id="btn-close-cart" class="text-slate-400 hover:text-white text-sm">Cerrar ✕</button>
            </div>

            <div class="mt-4 space-y-3 overflow-y-auto max-h-[65vh]">
              \${state.cart.length === 0 ? '<p class="text-slate-500 text-xs text-center py-8">Tu carrito está vacío.</p>' : ''}
              \${state.cart.map(item => \`
                <div class="p-3 bg-[#0E111A] rounded-xl flex items-center justify-between border border-slate-800">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl">\${item.image}</span>
                    <div>
                      <div class="text-xs font-bold text-white">\${item.name}</div>
                      <div class="text-[11px] font-mono text-slate-400">\$\${item.price} x \${item.qty}</div>
                    </div>
                  </div>
                  <span class="font-mono text-sm font-bold text-white">\$\${item.price * item.qty}</span>
                </div>
              \`).join('')}
            </div>
          </div>

          <div class="pt-4 border-t border-slate-800">
            <div class="flex items-center justify-between text-base font-bold text-white mb-4">
              <span>Total a pagar:</span>
              <span class="font-mono text-emerald-400">\$\${totalPrice}</span>
            </div>
            <button onclick="alert('¡Compra realizada con éxito en el sandbox!')" class="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all">
              Proceder al Pago
            </button>
          </div>
        </div>
      </div>
    \` : ''}
  \`;

  document.getElementById('btn-toggle-cart')?.addEventListener('click', () => { state.isCartOpen = !state.isCartOpen; render(); });
  document.getElementById('btn-close-cart')?.addEventListener('click', () => { state.isCartOpen = false; render(); });

  document.querySelectorAll('.btn-add-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = parseInt(btn.getAttribute('data-add'), 10);
      const prod = state.products.find(p => p.id === pid);
      if (prod) {
        const existing = state.cart.find(i => i.id === pid);
        if (existing) existing.qty += 1;
        else state.cart.push({ ...prod, qty: 1 });
        render();
      }
    });
  });
}

render();
`
  }
];

// ==========================================
// 4. TEMPLATE: PROYECTO EN BLANCO
// ==========================================
const BLANK_PROJECT_FILES: VirtualFile[] = [
  {
    path: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nuevo Proyecto — Web AI Studio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
  </head>
  <body class="bg-[#0B0E14] text-slate-100 min-h-screen flex items-center justify-center p-6">
    <div id="app" class="max-w-md w-full text-center"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
  },
  {
    path: 'src/main.js',
    language: 'javascript',
    content: `const app = document.getElementById('app');
if (app) {
  app.innerHTML = \`
    <div class="p-8 rounded-3xl bg-[#121622] border border-slate-800 shadow-2xl">
      <div class="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xl mx-auto mb-4">
        ✨
      </div>
      <h1 class="text-2xl font-bold text-white mb-2">Proyecto en Blanco Listo</h1>
      <p class="text-slate-400 text-xs leading-relaxed mb-6">
        Escribe en el chat qué deseas construir (ej: "crea una app de notas con categorías", "haz un clon de Spotify", o "crea un panel de finanzas").
      </p>
      <div class="p-3 bg-[#0A0D15] rounded-xl border border-slate-800/80 text-[11px] font-mono text-emerald-400">
        HTML5 + Tailwind CSS + JavaScript modular
      </div>
    </div>
  \`;
}
`
  }
];

// Array Principal de Plantillas
export const STARTER_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'interactive-landing',
    name: 'Landing Page Ultra-Interactiva',
    description: 'Landing futurista con simulador de código en vivo, playground de componentes, CLI interactivo y confeti.',
    category: 'Landing',
    badge: '⭐ Destacada',
    iconName: 'Sparkles',
    files: LANDING_PAGE_FILES
  },
  {
    id: 'saas-dashboard',
    name: 'SaaS Analytics Dashboard',
    description: 'Panel de métricas empresariales, KPI cards, visualizaciones de gráficos y pipeline de tareas.',
    category: 'SaaS',
    badge: 'Popular',
    iconName: 'BarChart3',
    files: SAAS_DASHBOARD_FILES
  },
  {
    id: 'ecommerce-store',
    name: 'E-Commerce & Sneaker Store',
    description: 'Catálogo de productos con carrito interactivo, cálculo de totales en vivo y modal de compra.',
    category: 'E-Commerce',
    badge: 'Nuevo',
    iconName: 'ShoppingBag',
    files: ECOMMERCE_FILES
  },
  {
    id: 'blank-canvas',
    name: 'Proyecto en Blanco (Limpio)',
    description: 'Estructura minimalista de HTML5 y Tailwind lista para pedir a la IA exactamente lo que necesites.',
    category: 'Blank',
    badge: 'Minimal',
    iconName: 'FileCode2',
    files: BLANK_PROJECT_FILES
  }
];
