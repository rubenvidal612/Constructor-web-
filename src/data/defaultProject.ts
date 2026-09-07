import { VirtualFile } from '../types';

export const INITIAL_FILES: VirtualFile[] = [
  {
    path: 'index.html',
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plataforma SaaS - Aplicación Generada con IA</title>
    <!-- Tailwind CSS CDN para vista previa en tiempo real -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
  </head>
  <body class="bg-slate-950 text-slate-100 min-h-screen antialiased selection:bg-indigo-500 selection:text-white">
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>`
  },
  {
    path: 'src/main.js',
    language: 'javascript',
    content: `// Almacén de Estado Reactivo
let state = {
  activeTab: 'metrics',
  tasks: [
    { id: 1, title: 'Conectar flujo OAuth con GitHub', status: 'completed', tag: 'Principal' },
    { id: 2, title: 'Configurar Webhook de despliegue en Vercel', status: 'completed', tag: 'DevOps' },
    { id: 3, title: 'Sincronizar tablas RLS en Supabase', status: 'in-progress', tag: 'Base de Datos' },
    { id: 4, title: 'Analizador de árbol de streaming IA', status: 'in-progress', tag: 'LLM' }
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
    <header class="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
            ⚡
          </div>
          <span class="font-bold text-lg tracking-tight text-white">CloudPulse Studio</span>
          <span class="px-2 py-0.5 text-xs font-semibold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">v2.4 En Vivo</span>
        </div>

        <nav class="flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-800">
          <button id="tab-metrics" class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all \${state.activeTab === 'metrics' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
            Panel Principal
          </button>
          <button id="tab-tasks" class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all \${state.activeTab === 'tasks' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}">
            Cola de Despliegue
          </button>
        </nav>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-6 py-8">
      \${state.activeTab === 'metrics' ? renderMetrics() : renderTasks()}
    </main>
  \`;

  document.getElementById('tab-metrics')?.addEventListener('click', () => {
    state.activeTab = 'metrics';
    render();
  });
  document.getElementById('tab-tasks')?.addEventListener('click', () => {
    state.activeTab = 'tasks';
    render();
  });

  document.querySelectorAll('.task-toggle').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = Number(e.currentTarget.dataset.id);
      state.tasks = state.tasks.map(t => t.id === id ? { ...t, status: t.status === 'completed' ? 'in-progress' : 'completed' } : t);
      render();
    });
  });
}

function renderMetrics() {
  return \`
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-slate-900/50 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 shadow-xl">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Infraestructura Cloud Activa</h2>
          <p class="text-sm text-slate-400 mt-1">Despliegues automatizados integrados con GitHub Octokit y Vercel CLI.</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/40 rounded-full border border-emerald-500/30">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Sincronización Activa
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Espacios de Trabajo</span>
          <div class="text-3xl font-extrabold text-white mt-2">\${state.stats.activeUsers}</div>
          <div class="text-xs text-emerald-400 mt-2 flex items-center gap-1">↑ +24% esta semana</div>
        </div>
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Despliegues en Vercel</span>
          <div class="text-3xl font-extrabold text-white mt-2">\${state.stats.deployments}</div>
          <div class="text-xs text-indigo-400 mt-2">Continuos y sin caídas</div>
        </div>
        <div class="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
          <span class="text-xs font-medium text-slate-400 uppercase tracking-wider">Sincronización GitHub</span>
          <div class="text-3xl font-extrabold text-white mt-2">\${state.stats.syncedRepos}</div>
          <div class="text-xs text-slate-400 mt-2">Rama objetivo: main</div>
        </div>
      </div>
    </div>
  \`;
}

function renderTasks() {
  return \`
    <div class="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-white">Tareas de Ejecución</h3>
        <span class="text-xs text-slate-400">Haz clic en la casilla para cambiar el estado</span>
      </div>
      <div class="space-y-2.5">
        \${state.tasks.map(task => \`
          <div class="flex items-center justify-between p-3.5 rounded-xl border transition-all \${task.status === 'completed' ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-800/40 border-slate-700/80'}">
            <div class="flex items-center gap-3">
              <button data-id="\${task.id}" class="task-toggle w-5 h-5 rounded-md flex items-center justify-center text-xs border \${task.status === 'completed' ? 'bg-emerald-600 border-emerald-500 text-white' : 'border-slate-600 text-transparent hover:border-slate-400'}">
                ✓
              </button>
              <span class="text-sm font-medium \${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-200'}">\${task.title}</span>
            </div>
            <span class="text-xs px-2.5 py-0.5 rounded-md font-mono bg-slate-800 text-slate-400 border border-slate-700/50">\${task.tag}</span>
          </div>
        \`).join('')}
      </div>
    </div>
  \`;
}

window.addEventListener('DOMContentLoaded', render);
render();`
  },
  {
    path: 'package.json',
    language: 'json',
    content: `{
  "name": "generated-ai-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.48.0"
  }
}`
  },
  {
    path: 'README.md',
    language: 'markdown',
    content: `# Aplicación Web Generada

Construida con el motor de código de **Web AI Studio**.

## Integraciones Configuradas
- **GitHub**: Confirmación y envío directo a la rama principal (main) mediante la API Git Trees de Octokit.
- **Vercel**: Despliegue en producción en tiempo real mediante la API de despliegues v13 de Vercel.
- **Supabase**: Inyección de cliente lista para base de datos relacional Postgres.

## Ejecución Local
\`\`\`bash
npm install
npm run dev
\`\`\`
`
  }
];
