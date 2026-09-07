import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { Smartphone, Monitor, Sparkles, Columns3, CheckCircle2, FolderKanban, Menu, Layout, User } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { ChatPanel } from './components/ChatPanel';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { GitHubHub } from './components/GitHubHub';
import { VercelHub } from './components/VercelHub';
import { SupabaseHub } from './components/SupabaseHub';
import { ArchitectureHub } from './components/ArchitectureHub';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileActionSheet } from './components/MobileActionSheet';
import { SettingsModal } from './components/SettingsModal';
import { ProjectPaletteModal } from './components/ProjectPaletteModal';
import { LandingPage } from './components/LandingPage';
import { PaletteDrawerMenu } from './components/PaletteDrawerMenu';
import { RegistrationModal } from './components/RegistrationModal';
import { INITIAL_FILES } from './data/defaultProject';
import { STARTER_TEMPLATES } from './data/templates';
import {
  VirtualFile,
  GitHubUser,
  VercelUser,
  VercelDeployment,
  SupabaseConfig,
  ChatMessage,
  LLMConfig,
  ChatAttachment,
  ChatSession,
  SavedProject,
  ProjectTemplate,
  AppUser,
} from './types';

const DEFAULT_LANDING_PROJECT: SavedProject = {
  id: 'proj-landing',
  name: 'devnova-landing',
  description: 'Landing Page Ultra-Interactiva con playground, simulador y CLI',
  updatedAt: 'Hoy',
  files: STARTER_TEMPLATES[0].files,
  templateId: 'interactive-landing',
};

const DEFAULT_SAAS_PROJECT: SavedProject = {
  id: 'proj-default-1',
  name: 'cloudpulse-saas',
  description: 'SaaS Analytics Dashboard con métricas y pipeline',
  updatedAt: 'Hoy',
  files: INITIAL_FILES,
  templateId: 'saas-dashboard',
};

export default function App() {
  // Multi-Project Management state with localStorage persistence
  const [currentProjectId, setCurrentProjectId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ais_current_project_id');
      if (saved && saved !== 'proj-default-1') {
        return saved;
      }
      return 'proj-landing';
    } catch {
      return 'proj-landing';
    }
  });

  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const saved = localStorage.getItem('ais_saved_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasLanding = parsed.some(
            (p) =>
              p.id === 'proj-landing' ||
              p.templateId === 'interactive-landing' ||
              p.name === 'devnova-landing'
          );
          if (!hasLanding) {
            return [DEFAULT_LANDING_PROJECT, ...parsed];
          }
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return [DEFAULT_LANDING_PROJECT, DEFAULT_SAAS_PROJECT];
  });

  const [isProjectPaletteOpen, setIsProjectPaletteOpen] = useState<boolean>(false);

  // Top-Level Application View: 'landing' (Public marketing & registration page) | 'studio' (IDE Workspace)
  const [activeAppView, setActiveAppView] = useState<'landing' | 'studio'>(() => {
    try {
      const saved = localStorage.getItem('ais_active_app_view');
      if (saved === 'studio' || saved === 'landing') return saved;
    } catch {
      // ignore
    }
    return 'landing'; // Default to the official Landing Page for visitors
  });

  // Current registered user
  const [currentUser, setCurrentUser] = useState<AppUser | null>(() => {
    try {
      const saved = localStorage.getItem('ais_current_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  // Palette drawer menu (triggered by 3-lines hamburger button)
  const [isPaletteDrawerOpen, setIsPaletteDrawerOpen] = useState<boolean>(false);

  // Registration & Login modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalPlan, setAuthModalPlan] = useState<'free' | 'pro' | 'team'>('free');

  // Initialize files and project name from the active project
  const [projectName, setProjectName] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('ais_saved_projects');
      const curId = localStorage.getItem('ais_current_project_id');
      if (saved && curId && curId !== 'proj-default-1') {
        const parsed: SavedProject[] = JSON.parse(saved);
        const match = parsed.find((p) => p.id === curId);
        if (match) return match.name;
      }
    } catch {
      // ignore
    }
    return 'devnova-landing';
  });

  const [files, setFiles] = useState<VirtualFile[]>(() => {
    try {
      const saved = localStorage.getItem('ais_saved_projects');
      const curId = localStorage.getItem('ais_current_project_id');
      if (saved && curId && curId !== 'proj-default-1') {
        const parsed: SavedProject[] = JSON.parse(saved);
        const match = parsed.find((p) => p.id === curId);
        if (match && match.files?.length) return match.files;
      }
    } catch {
      // ignore
    }
    return STARTER_TEMPLATES[0].files;
  });

  const [activeFilePath, setActiveFilePath] = useState<string>('index.html');

  // Integrations state
  const [githubUser, setGithubUser] = useState<GitHubUser | null>(() => {
    try {
      const saved = localStorage.getItem('ais_github_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [githubToken, setGithubToken] = useState<string>(() => {
    try {
      return localStorage.getItem('ais_github_token') || '';
    } catch {
      return '';
    }
  });
  const [currentRepoName, setCurrentRepoName] = useState<string>(() => {
    try {
      return localStorage.getItem('ais_github_current_repo') || '';
    } catch {
      return '';
    }
  });

  const [vercelUser, setVercelUser] = useState<VercelUser | null>(null);
  const [vercelToken, setVercelToken] = useState<string>('');
  const [lastDeployment, setLastDeployment] = useState<VercelDeployment | null>(null);

  const [supabaseConfig, setSupabaseConfig] = useState<SupabaseConfig>({
    url: '',
    anonKey: '',
    isConnected: false,
  });
  const [injectSupabase, setInjectSupabase] = useState<boolean>(false);

  // Desktop Right Panel Tab
  const [rightTab, setRightTab] = useState<'preview' | 'github' | 'vercel' | 'supabase' | 'architecture'>('preview');

  // View Mode: 'mobile' (Google AI Studio mobile experience) or 'desktop' (3-panel workstation)
  // Default to 'mobile' as explicitly requested by user!
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

  // Helper to calculate balanced widths so the middle panel ("lo de enmedio") is spacious and clearly visible
  const calculateBalancedWidths = (winWidth = typeof window !== 'undefined' ? window.innerWidth : 1100) => {
    if (winWidth < 950) {
      // Narrow screen or embedded iframe preview: allocate ~28% left, ~38% center, ~34% right
      const chat = Math.max(200, Math.floor(winWidth * 0.28));
      const right = Math.max(240, Math.floor(winWidth * 0.34));
      return { chat, right };
    } else if (winWidth < 1300) {
      // Medium screen: left ~280px-340px, right ~340px-420px, leaving 400px+ for center
      const chat = Math.max(240, Math.floor(winWidth * 0.28));
      const right = Math.max(290, Math.floor(winWidth * 0.34));
      return { chat, right };
    } else {
      // Wide desktop
      const chat = Math.min(340, Math.floor(winWidth * 0.26));
      const right = Math.min(460, Math.floor(winWidth * 0.34));
      return { chat, right };
    }
  };

  // Desktop resizable panel widths initialized with balanced proportions
  const [chatWidth, setChatWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return calculateBalancedWidths(window.innerWidth).chat;
    }
    return 270;
  });
  const [rightPanelWidth, setRightPanelWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      return calculateBalancedWidths(window.innerWidth).right;
    }
    return 330;
  });
  const [isResizingLeft, setIsResizingLeft] = useState<boolean>(false);
  const [isResizingRight, setIsResizingRight] = useState<boolean>(false);

  // Restore or re-balance all 3 columns evenly so center panel is always prominent
  const handleBalancePanels = () => {
    const balanced = calculateBalancedWidths(window.innerWidth);
    setChatWidth(balanced.chat);
    setRightPanelWidth(balanced.right);
  };

  const handleSwitchToDesktop = () => {
    setViewMode('desktop');
    const balanced = calculateBalancedWidths(window.innerWidth);
    setChatWidth(balanced.chat);
    setRightPanelWidth(balanced.right);
  };

  useEffect(() => {
    if (!isResizingLeft && !isResizingRight) return;

    const handleMouseMove = (e: MouseEvent) => {
      const minCenter = 260; // GUARANTEES middle panel ("lo de enmedio") always has at least 260px
      const totalWidth = window.innerWidth;

      if (isResizingLeft) {
        const maxAllowedChat = Math.max(200, totalWidth - rightPanelWidth - minCenter);
        const newWidth = Math.min(Math.max(e.clientX, 200), maxAllowedChat);
        setChatWidth(newWidth);
      } else if (isResizingRight) {
        const maxAllowedRight = Math.max(240, totalWidth - chatWidth - minCenter);
        const rightDist = totalWidth - e.clientX;
        const newWidth = Math.min(Math.max(rightDist, 240), maxAllowedRight);
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, chatWidth, rightPanelWidth]);

  // Mobile navigation tab ('chat' | 'preview' | 'code')
  const [mobileTab, setMobileTab] = useState<'chat' | 'preview' | 'code'>('chat');
  const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsTab, setSettingsTab] = useState<'chat' | 'share' | 'publish' | 'versions' | 'github' | 'integrations' | 'secrets'>('chat');
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [executionSeconds, setExecutionSeconds] = useState<number>(4);

  // Custom system instructions
  const [systemPrompt, setSystemPrompt] = useState<string>(
    'Lo que estemos construyendo quiero que todo sea funcional y no simulado ya que queremos que al final sirva para usarlo realmente. Todo debe responderse y explicarse siempre en español.'
  );

  // LLM Config (Default to Gemini 2.5 Flash - 100% Free & Built-in Google AI Studio)
  const [llmConfig, setLlmConfig] = useState<LLMConfig>({
    provider: 'gemini',
    bAiModel: 'gemini-2.5-flash',
    modelName: 'Gemini 2.5 Flash',
  });

  // Chat Sessions History (matching Google AI Studio Screenshot 2)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('ais_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'session-lead-1',
        title: 'Actúa como un Tech Lead Full-Sta...',
        updatedAt: '6 sept, 02:59 a.m.',
        messages: [
          {
            id: 'lead-msg-1',
            role: 'user',
            content: 'Actúa como un Tech Lead Full-Stack y revisa la arquitectura de mi proyecto.',
            timestamp: '02:59 a.m.',
          },
          {
            id: 'lead-msg-2',
            role: 'assistant',
            content: 'Entendido. Como Tech Lead Full-Stack, he revisado la estructura de la aplicación. Tu entorno cuenta con configuración Vite, servidor Express para proxy seguro y componentes modulares listos para producción.',
            timestamp: '02:59 a.m.',
          },
        ],
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('ais_chat_sessions', JSON.stringify(chatSessions));
    } catch {
      // ignore
    }
  }, [chatSessions]);

  // Chat History with initial checkpoint snapshot
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `¡Te damos la bienvenida a **Web AI Studio**! Soy tu Arquitecto de IA e Ingeniero de Software Full-Stack.

Puedes pedirme modificar componentes de interfaz, generar modelos de datos reales, conectar autenticación con Supabase o crear nuevas funcionalidades. Todo lo que generamos es 100% funcional y listo para usar en producción.

¡Usa los controles de navegación para alternar entre el chat, el código y la vista previa en vivo de tu aplicación!`,
      timestamp: new Date().toLocaleTimeString(),
      durationSeconds: 3,
      checkpointFiles: JSON.parse(JSON.stringify(STARTER_TEMPLATES[0].files)),
    },
  ]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Handler for "Start new chat" (Screenshot 2)
  const handleStartNewChat = () => {
    const firstUserMsg = messages.find((m) => m.role === 'user');
    if (firstUserMsg) {
      const title =
        firstUserMsg.content.slice(0, 36) + (firstUserMsg.content.length > 36 ? '...' : '');
      const now = new Date();
      const dateFormatted = `${now.getDate()} sept, ${now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`;

      setChatSessions((prev) => [
        {
          id: Math.random().toString(36).substring(7),
          title,
          updatedAt: dateFormatted,
          messages: [...messages],
        },
        ...prev.filter((s) => s.title !== title),
      ]);
    }

    setMessages([
      {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: 'Nueva sesión iniciada. ¿Qué te gustaría construir o modificar en la aplicación hoy?',
        timestamp: new Date().toLocaleTimeString(),
        checkpointFiles: JSON.parse(JSON.stringify(files)),
      },
    ]);
  };

  const handleSelectSession = (session: ChatSession) => {
    setMessages(session.messages);
  };

  // Auto-detect window size, but keep 'mobile' default unless user switches
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('mobile');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Send AI Prompt
  const handleSendMessage = async (promptText: string, attachments?: ChatAttachment[]) => {
    const startTime = Date.now();
    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: promptText,
      timestamp: new Date().toLocaleTimeString(),
      attachments,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    const snapshotBefore = JSON.parse(JSON.stringify(files));

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          systemPrompt,
          files: files.map((f) => ({ path: f.path, content: f.content, language: f.language })),
          supabaseConfig,
          injectSupabase,
          provider: llmConfig.provider,
          customEndpoint: llmConfig.customEndpoint,
          customApiKey: llmConfig.customApiKey,
          customModel: llmConfig.modelName,
          bAiApiKey: llmConfig.bAiApiKey,
          bAiModel: llmConfig.bAiModel,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Falló la generación con IA');
      }

      const elapsed = Math.max(1, Math.round((Date.now() - startTime) / 1000));
      setExecutionSeconds(elapsed);

      // Merge updated/new files
      const modifiedPaths: string[] = [];
      const updatedFiles = [...files];

      if (data.files && Array.isArray(data.files)) {
        for (const incoming of data.files) {
          modifiedPaths.push(incoming.path);
          const existingIdx = updatedFiles.findIndex((f) => f.path === incoming.path);
          if (existingIdx >= 0) {
            updatedFiles[existingIdx] = {
              ...updatedFiles[existingIdx],
              content: incoming.content,
              isModified: true,
            };
          } else {
            updatedFiles.push({
              path: incoming.path,
              content: incoming.content,
              language: incoming.language || 'javascript',
              isNew: true,
              isModified: true,
            });
          }
        }
      }

      setFiles(updatedFiles);

      // Add assistant reply with snapshot for Checkpoint / Restore
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.assistantMessage || 'Archivos de la aplicación actualizados correctamente.',
        timestamp: new Date().toLocaleTimeString(),
        filesModified: modifiedPaths,
        durationSeconds: elapsed,
        previousFiles: snapshotBefore,
        checkpointFiles: JSON.parse(JSON.stringify(updatedFiles)),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If a file was modified, select it
      if (modifiedPaths.length > 0) {
        setActiveFilePath(modifiedPaths[0]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(7),
          role: 'assistant',
          content: `⚠️ Error durante la generación de código con IA: ${err.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  // Restore snapshot handler
  const handleRestoreCheckpoint = (snapshotFiles: VirtualFile[], label?: string) => {
    if (!snapshotFiles || snapshotFiles.length === 0) return;
    setFiles(JSON.parse(JSON.stringify(snapshotFiles)));
    if (snapshotFiles.length > 0) {
      setActiveFilePath(snapshotFiles[0].path);
    }
    setReloadTrigger((prev) => prev + 1);
    setToastMessage(label || 'Punto de restauración recuperado con éxito');
    setTimeout(() => setToastMessage(null), 3500);
  };

  // File Handlers
  const handleFileChange = (path: string, newContent: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.path === path ? { ...f, content: newContent, isModified: true } : f))
    );
  };

  const handleCreateFile = (newPath: string) => {
    if (files.some((f) => f.path === newPath)) {
      setActiveFilePath(newPath);
      return;
    }

    const ext = newPath.split('.').pop() || '';
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      sql: 'sql',
    };

    const newFile: VirtualFile = {
      path: newPath,
      content: `// ${newPath}\n`,
      language: languageMap[ext] || 'text',
      isNew: true,
    };

    setFiles((prev) => [...prev, newFile]);
    setActiveFilePath(newPath);
  };

  const handleDeleteFile = (pathToDelete: string) => {
    if (files.length <= 1) return;
    const remaining = files.filter((f) => f.path !== pathToDelete);
    setFiles(remaining);
    if (activeFilePath === pathToDelete) {
      setActiveFilePath(remaining[0].path);
    }
  };

  const handleImportFiles = (importedFiles: VirtualFile[], repoName: string) => {
    setFiles(importedFiles);
    setCurrentRepoName(repoName);
    setProjectName(repoName);
    if (importedFiles.length > 0) {
      setActiveFilePath(importedFiles[0].path);
    }
    setRightTab('preview');
    setMobileTab('preview');
  };

  const handleInjectSupabaseFiles = (newFiles: VirtualFile[]) => {
    const updated = [...files];
    for (const nf of newFiles) {
      const idx = updated.findIndex((f) => f.path === nf.path);
      if (idx >= 0) {
        updated[idx] = nf;
      } else {
        updated.push(nf);
      }
    }
    setFiles(updated);
    if (newFiles.length > 0) {
      setActiveFilePath(newFiles[0].path);
    }
  };

  const handleDownloadZip = async () => {
    try {
      setToastMessage('📦 Empaquetando y descargando proyecto en ZIP...');
      const zip = new JSZip();

      for (const f of files) {
        const safePath = f.path.startsWith('/') ? f.path.slice(1) : f.path;
        zip.file(safePath, f.content);
      }

      if (!files.some((f) => f.path.toLowerCase().includes('readme'))) {
        zip.file(
          'README.md',
          `# ${projectName || 'Mi Proyecto Web AI'}

Proyecto generado con Web AI Studio.

## 🚀 Cómo ejecutar en local

1. Instala las dependencias:
\`\`\`bash
npm install
\`\`\`

2. Inicia el entorno de desarrollo:
\`\`\`bash
npm run dev
\`\`\`

3. Abre tu navegador en [http://localhost:3000](http://localhost:3000) o el puerto asignado por Vite.

## 📦 Despliegue en Producción

\`\`\`bash
npm run build
\`\`\`
`
        );
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName ? projectName.trim().replace(/\s+/g, '-').toLowerCase() : 'ai-web-app'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setToastMessage('✅ Archivo ZIP descargado con éxito');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err: any) {
      setToastMessage(`⚠️ Error al exportar ZIP: ${err.message}`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  // Keyboard shortcut Ctrl+K / Cmd+K to toggle Project & Template Palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsProjectPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-save current project to savedProjects and LocalStorage
  useEffect(() => {
    setSavedProjects((prev) => {
      const exists = prev.some((p) => p.id === currentProjectId);
      let updated: SavedProject[];
      const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

      if (exists) {
        updated = prev.map((p) => {
          if (p.id === currentProjectId) {
            return {
              ...p,
              name: projectName,
              files,
              updatedAt: timeStr,
            };
          }
          return p;
        });
      } else {
        updated = [
          ...prev,
          {
            id: currentProjectId,
            name: projectName,
            files,
            updatedAt: timeStr,
          },
        ];
      }
      try {
        localStorage.setItem('ais_saved_projects', JSON.stringify(updated));
        localStorage.setItem('ais_current_project_id', currentProjectId);
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
      return updated;
    });
  }, [files, projectName, currentProjectId]);

  // Project Management Handlers
  const handleSelectProject = (project: SavedProject) => {
    setCurrentProjectId(project.id);
    setProjectName(project.name);
    setFiles(project.files);
    if (project.files.length > 0) {
      setActiveFilePath(project.files[0].path);
    }
    setReloadTrigger((prev) => prev + 1);
    setToastMessage(`📂 Proyecto "${project.name}" cargado`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectTemplate = (template: ProjectTemplate) => {
    const newId = 'proj-' + Date.now();
    const formattedName =
      template.id === 'interactive-landing'
        ? 'devnova-landing'
        : template.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    const newProject: SavedProject = {
      id: newId,
      name: formattedName,
      description: template.description,
      updatedAt: timeStr,
      files: template.files,
      templateId: template.id,
    };

    setSavedProjects((prev) => [newProject, ...prev]);
    setCurrentProjectId(newId);
    setProjectName(formattedName);
    setFiles(template.files);
    if (template.files.length > 0) {
      setActiveFilePath(template.files[0].path);
    }
    setRightTab('preview');
    setMobileTab('preview');
    setReloadTrigger((prev) => prev + 1);
    setToastMessage(`✨ Plantilla "${template.name}" cargada e interactiva`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const isLandingActive =
    currentProjectId === 'proj-landing' ||
    projectName === 'devnova-landing' ||
    files.some(
      (f) =>
        f.content?.includes('DevNova AI') ||
        f.content?.includes('Landing Page Ultra-Interactiva') ||
        f.content?.includes('Plataforma Integral de Ingeniería')
    );

  const handleLoadLandingPage = () => {
    const landingProject = savedProjects.find(
      (p) =>
        p.id === 'proj-landing' ||
        p.templateId === 'interactive-landing' ||
        p.name === 'devnova-landing'
    );
    if (landingProject) {
      handleSelectProject(landingProject);
    } else {
      handleSelectTemplate(STARTER_TEMPLATES[0]);
    }
    setRightTab('preview');
    setMobileTab('preview');
    setReloadTrigger((prev) => prev + 1);
    setToastMessage('🚀 Landing Page Ultra-Interactiva cargada en la vista previa');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateNewProject = (name?: string) => {
    const newId = 'proj-' + Date.now();
    const cleanName = name?.trim() || `mi-proyecto-${savedProjects.length + 1}`;
    const blankTemplate = STARTER_TEMPLATES.find((t) => t.id === 'blank-canvas') || STARTER_TEMPLATES[0];
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const newProj: SavedProject = {
      id: newId,
      name: cleanName,
      description: 'Nuevo proyecto creado en Web AI Studio',
      updatedAt: timeStr,
      files: blankTemplate.files,
      templateId: blankTemplate.id,
    };

    setSavedProjects((prev) => [newProj, ...prev]);
    setCurrentProjectId(newId);
    setProjectName(cleanName);
    setFiles(blankTemplate.files);
    if (blankTemplate.files.length > 0) {
      setActiveFilePath(blankTemplate.files[0].path);
    }
    setReloadTrigger((prev) => prev + 1);
    setToastMessage(`🚀 Nuevo proyecto "${cleanName}" creado`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDuplicateProject = (projectId: string) => {
    const original = savedProjects.find((p) => p.id === projectId);
    if (!original) return;

    const newId = 'proj-' + Date.now();
    const copyName = `${original.name}-copia`;
    const timeStr = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const duplicated: SavedProject = {
      id: newId,
      name: copyName,
      description: `Copia de ${original.name}`,
      updatedAt: timeStr,
      files: JSON.parse(JSON.stringify(original.files)),
      templateId: original.templateId,
    };

    setSavedProjects((prev) => [duplicated, ...prev]);
    setToastMessage(`📋 Proyecto duplicado como "${copyName}"`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteProject = (projectId: string) => {
    if (savedProjects.length <= 1) {
      setToastMessage('⚠️ No puedes eliminar el único proyecto existente.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const remaining = savedProjects.filter((p) => p.id !== projectId);
    setSavedProjects(remaining);

    if (currentProjectId === projectId) {
      const next = remaining[0];
      setCurrentProjectId(next.id);
      setProjectName(next.name);
      setFiles(next.files);
      if (next.files.length > 0) setActiveFilePath(next.files[0].path);
      setReloadTrigger((prev) => prev + 1);
    }

    setToastMessage(`🗑️ Proyecto eliminado`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleOpenSettingsTab = (tab: typeof settingsTab) => {
    setSettingsTab(tab);
    setIsSettingsModalOpen(true);
  };

  const handleSelectAppView = (view: 'landing' | 'studio') => {
    setActiveAppView(view);
    try {
      localStorage.setItem('ais_active_app_view', view);
    } catch {
      // ignore
    }
  };

  const handleOpenAuthModal = (plan?: 'free' | 'pro' | 'team') => {
    setAuthModalPlan(plan || 'free');
    setIsAuthModalOpen(true);
  };

  const handleUserRegister = (user: AppUser) => {
    setCurrentUser(user);
    if (user.modelPreference?.includes('Gemini')) {
      setLlmConfig({
        provider: 'gemini',
        modelName: 'Gemini 2.5 Flash',
        bAiModel: 'gemini-2.5-flash',
      });
    }
    setToastMessage(`🎉 ¡Bienvenido a Web AI Studio, ${user.name}!`);
    setTimeout(() => setToastMessage(null), 4000);
    handleSelectAppView('studio');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ais_current_user');
    } catch {
      // ignore
    }
    setCurrentUser(null);
    setToastMessage('👋 Sesión cerrada exitosamente');
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleEnterStudio = (initialPrompt?: string) => {
    handleSelectAppView('studio');
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
    }
  };

  const hasUncommittedChanges = files.some((f) => f.isModified || f.isNew);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0F1115] text-[#E2E8F0] overflow-hidden font-sans select-none">
      {/* ========================================================
          GLOBAL VIEW MODE SWITCHER BAR (Always allows toggling)
         ======================================================== */}
      <div className="h-9 bg-[#090B0E] border-b border-[#242830] px-3 flex items-center justify-between text-xs shrink-0 z-40">
        <div className="flex items-center gap-2">
          {/* 3-Lines Hamburger Palette Menu Button */}
          <button
            onClick={() => setIsPaletteDrawerOpen(true)}
            className="p-1 rounded-md bg-[#16191E] hover:bg-[#1E232B] border border-[#2B303C] text-gray-300 hover:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer group"
            title="Abrir Menú de Paleta (3 líneas)"
            id="global-hamburger-btn"
          >
            <Menu className="w-4 h-4 text-blue-400 group-hover:scale-105 transition-transform" />
            <span className="hidden xl:inline text-[11px] font-semibold text-gray-200">Menú</span>
          </button>

          <div className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
            <Sparkles className="w-3 h-3 fill-blue-400" />
          </div>
          <span className="font-semibold text-xs tracking-tight text-white font-mono">
            WEBAI.STUDIO
          </span>

          {/* Main View Switcher: Landing Page vs Studio IDE */}
          <div className="flex items-center bg-[#16191E] p-0.5 rounded-lg border border-[#2D3139] ml-1">
            <button
              onClick={() => handleSelectAppView('landing')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeAppView === 'landing'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Página principal de marketing y registro"
            >
              <Layout className="w-3 h-3 text-blue-400" />
              <span>Landing Page</span>
            </button>
            <button
              onClick={() => handleSelectAppView('studio')}
              className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-medium transition-all ${
                activeAppView === 'studio'
                  ? 'bg-blue-600 text-white font-semibold shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              title="Entorno de desarrollo y agentes IA"
            >
              <Monitor className="w-3 h-3" />
              <span>Studio IDE</span>
            </button>
          </div>

          <button
            onClick={() => setIsProjectPaletteOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#16191E] hover:bg-[#1E232B] border border-[#2B303C] text-blue-300 hover:text-white text-[11px] font-semibold transition-all ml-1"
            title="Abrir menú de proyectos y plantillas interactivas (⌘K)"
          >
            <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Plantillas</span>
            <kbd className="hidden md:inline px-1 py-0.2 text-[9px] bg-[#0E1015] rounded border border-gray-700 text-gray-400 font-mono">⌘K</kbd>
          </button>
        </div>

        {/* View Mode Switcher Pill & User profile */}
        <div className="flex items-center gap-2">
          {activeAppView === 'studio' && (
            <>
              <div className="flex items-center bg-[#16191E] p-0.5 rounded-lg border border-[#2D3139]">
                <button
                  onClick={() => setViewMode('mobile')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === 'mobile'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  title="Ver vista para celular (Google AI Studio)"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Vista Celular</span>
                </button>

                <button
                  onClick={handleSwitchToDesktop}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    viewMode === 'desktop'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  title="Ver vista de escritorio (3 Paneles equilibrados)"
                >
                  <Monitor className="w-3 h-3" />
                  <span>Escritorio</span>
                </button>
              </div>

              {viewMode === 'desktop' && (
                <button
                  onClick={handleBalancePanels}
                  className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#16191E] hover:bg-[#1E2227] border border-[#2D3139] text-gray-300 hover:text-white text-[11px] font-mono transition-all shadow-sm"
                  title="Equilibrar las 3 columnas para que el editor central y los archivos se vean con amplitud"
                >
                  <Columns3 className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline">Equilibrar</span>
                </button>
              )}
            </>
          )}

          {/* User Profile or Register CTA */}
          {currentUser ? (
            <button
              onClick={() => setIsPaletteDrawerOpen(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 bg-[#16191E] hover:bg-[#1E232B] border border-[#2D3139] hover:border-blue-500 rounded-full text-xs transition-all cursor-pointer"
              title="Mi Cuenta"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-gray-200 text-[11px] font-medium hidden sm:inline max-w-[90px] truncate">
                {currentUser.name}
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleOpenAuthModal('free')}
              className="flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-sm"
              title="Crear cuenta o iniciar sesión"
            >
              <User className="w-3 h-3" />
              <span>Registrarse</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          MAIN APP CONTENT: REAL LANDING PAGE vs STUDIO IDE
         ======================================================== */}
      {activeAppView === 'landing' ? (
        <div className="flex-1 overflow-y-auto min-h-0 bg-[#0A0C10]">
          <LandingPage
            onEnterStudio={handleEnterStudio}
            onOpenAuthModal={handleOpenAuthModal}
            currentUser={currentUser}
            onOpenPaletteMenu={() => setIsPaletteDrawerOpen(true)}
            onUserRegister={handleUserRegister}
          />
        </div>
      ) : (
        <>
          {/* ========================================================
              1. GOOGLE AI STUDIO MOBILE VIEW
              (Screenshot 1: Sparkle, Chat stream, [ Chat | Preview ], More menu)
             ======================================================== */}
          {viewMode === 'mobile' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0F1115] items-center justify-center relative overflow-hidden">
          {/* Mobile frame container (Fluid on mobile, centered phone canvas on wide screens) */}
          <div className="w-full max-w-lg h-full flex flex-col bg-[#16191E] sm:border-x sm:border-[#2D3139] sm:shadow-2xl relative overflow-hidden">
            {/* View container */}
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {mobileTab === 'chat' && (
                <>
                  {!isLandingActive ? (
                    <div className="bg-gradient-to-r from-blue-950/50 via-indigo-950/40 to-[#16191E] border-b border-blue-500/30 px-3 py-1.5 flex items-center justify-between text-xs shrink-0">
                      <span className="text-blue-200 flex items-center gap-1.5 text-[11px] font-medium">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>¿Explorar la Landing Page?</span>
                      </span>
                      <button
                        onClick={handleLoadLandingPage}
                        className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10.5px] font-semibold transition-colors shadow-sm"
                      >
                        Cargar y Ver
                      </button>
                    </div>
                  ) : (
                    <div className="bg-[#0e1627] border-b border-blue-900/40 px-3 py-1 flex items-center justify-between text-xs shrink-0">
                      <span className="text-blue-300 flex items-center gap-1.5 text-[10.5px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Landing Page activa</span>
                      </span>
                      <button
                        onClick={() => setMobileTab('preview')}
                        className="px-2 py-0.5 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-200 rounded text-[10px] font-medium transition-colors"
                      >
                        Abrir Preview &rarr;
                      </button>
                    </div>
                  )}

                  <ChatPanel
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isGenerating={isGenerating}
                    llmConfig={llmConfig}
                    setLlmConfig={setLlmConfig}
                    injectSupabase={injectSupabase}
                    setInjectSupabase={setInjectSupabase}
                    supabaseConfig={supabaseConfig}
                    onSelectFile={(path) => {
                      setActiveFilePath(path);
                      setMobileTab('code');
                    }}
                    onNewChat={handleStartNewChat}
                    chatSessions={chatSessions}
                    onSelectSession={handleSelectSession}
                    onRestoreCheckpoint={handleRestoreCheckpoint}
                    allFiles={files}
                    onOpenSettingsModal={() => handleOpenSettingsTab('chat')}
                    executionSeconds={executionSeconds}
                  />
                </>
              )}

              {mobileTab === 'preview' && (
                <PreviewPanel
                  files={files}
                  reloadTrigger={reloadTrigger}
                  isLandingActive={isLandingActive}
                  onLoadLandingPage={handleLoadLandingPage}
                />
              )}

              {mobileTab === 'code' && (
                <EditorPanel
                  files={files}
                  activeFilePath={activeFilePath}
                  setActiveFilePath={setActiveFilePath}
                  onFileChange={handleFileChange}
                  onCreateFile={handleCreateFile}
                  onDeleteFile={handleDeleteFile}
                />
              )}
            </div>

            {/* Google AI Studio Mobile Bottom Nav [ Chat | Preview ] (Screenshot 1) */}
            <MobileBottomNav
              activeTab={mobileTab}
              setActiveTab={setMobileTab}
              onOpenMenu={() => setIsActionSheetOpen(true)}
              onBack={() => setMobileTab('chat')}
              onOpenPaletteMenu={() => setIsPaletteDrawerOpen(true)}
            />
          </div>
        </div>
      ) : (
        /* ========================================================
            2. DESKTOP 3-PANEL WORKSPACE
           ======================================================== */
        <div className="flex-1 flex flex-col min-h-0">
          <Navbar
            projectName={projectName}
            setProjectName={setProjectName}
            githubUser={githubUser}
            vercelUser={vercelUser}
            supabaseConfig={supabaseConfig}
            rightTab={rightTab}
            setRightTab={setRightTab}
            onOpenPushModal={() => {
              setRightTab('github');
              handleOpenSettingsTab('github');
            }}
            onOpenDeployModal={() => {
              setRightTab('vercel');
              handleOpenSettingsTab('publish');
            }}
            onDownloadZip={handleDownloadZip}
            onOpenProjectPalette={() => setIsProjectPaletteOpen(true)}
            hasUncommittedChanges={hasUncommittedChanges}
            isLandingActive={isLandingActive}
            onLoadLandingPage={handleLoadLandingPage}
            onOpenPaletteMenu={() => setIsPaletteDrawerOpen(true)}
            onSelectAppView={handleSelectAppView}
            currentUser={currentUser}
            onOpenAuthModal={() => handleOpenAuthModal('free')}
          />

          <div className="flex-1 flex min-h-0 relative">
            {/* Transparent overlay while dragging to keep mouse events smooth over iframes */}
            {(isResizingLeft || isResizingRight) && (
              <div className="fixed inset-0 z-50 cursor-col-resize select-none bg-transparent" />
            )}

            {/* Left Panel: AI Chat & Prompt Engine */}
            <div
              style={{ width: `${chatWidth}px` }}
              className="flex flex-col shrink-0 bg-[#16191E] border-r border-[#2D3139] relative min-w-[200px] max-w-[650px]"
            >
              <ChatPanel
                messages={messages}
                onSendMessage={handleSendMessage}
                isGenerating={isGenerating}
                llmConfig={llmConfig}
                setLlmConfig={setLlmConfig}
                injectSupabase={injectSupabase}
                setInjectSupabase={setInjectSupabase}
                supabaseConfig={supabaseConfig}
                onSelectFile={(path) => setActiveFilePath(path)}
                onNewChat={handleStartNewChat}
                chatSessions={chatSessions}
                onSelectSession={handleSelectSession}
                onRestoreCheckpoint={handleRestoreCheckpoint}
                allFiles={files}
                onOpenSettingsModal={() => handleOpenSettingsTab('chat')}
                executionSeconds={executionSeconds}
              />
            </div>

            {/* Resizable Splitter 1: Left (Chat) <-> Center (Editor) */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingLeft(true);
              }}
              onDoubleClick={handleBalancePanels}
              title="Arrastra hacia los lados para redimensionar (Doble clic para equilibrar las 3 columnas y ver bien el centro)"
              className={`w-2 hover:w-2.5 transition-all cursor-col-resize flex items-center justify-center relative group z-20 select-none shrink-0 ${
                isResizingLeft ? 'bg-blue-500 w-2.5 shadow-lg shadow-blue-500/50' : 'bg-[#12151B] border-x border-[#2D3139] hover:bg-blue-600/40'
              }`}
            >
              <div className="w-0.5 h-8 bg-gray-500/50 group-hover:bg-blue-300 rounded-full" />
            </div>

            {/* Center Panel: Code Editor & Virtual File Tree */}
            <div className="flex-1 flex flex-col min-w-[260px] bg-[#0F1115] overflow-hidden">
              <EditorPanel
                files={files}
                activeFilePath={activeFilePath}
                setActiveFilePath={setActiveFilePath}
                onFileChange={handleFileChange}
                onCreateFile={handleCreateFile}
                onDeleteFile={handleDeleteFile}
              />
            </div>

            {/* Resizable Splitter 2: Center (Editor) <-> Right (Preview/Hubs) */}
            <div
              onMouseDown={(e) => {
                e.preventDefault();
                setIsResizingRight(true);
              }}
              onDoubleClick={handleBalancePanels}
              title="Arrastra hacia los lados para redimensionar (Doble clic para equilibrar las 3 columnas y ver bien el centro)"
              className={`w-2 hover:w-2.5 transition-all cursor-col-resize flex items-center justify-center relative group z-20 select-none shrink-0 ${
                isResizingRight ? 'bg-blue-500 w-2.5 shadow-lg shadow-blue-500/50' : 'bg-[#12151B] border-x border-[#2D3139] hover:bg-blue-600/40'
              }`}
            >
              <div className="w-0.5 h-8 bg-gray-500/50 group-hover:bg-blue-300 rounded-full" />
            </div>

            {/* Right Panel: Live Preview & Integration Hubs */}
            <div
              style={{ width: `${rightPanelWidth}px` }}
              className="flex flex-col shrink-0 bg-[#16191E] border-l border-[#2D3139] relative min-w-[240px] max-w-[950px]"
            >
              {rightTab === 'preview' && (
                <PreviewPanel
                  files={files}
                  reloadTrigger={reloadTrigger}
                  isLandingActive={isLandingActive}
                  onLoadLandingPage={handleLoadLandingPage}
                />
              )}
              {rightTab === 'github' && (
                <GitHubHub
                  githubUser={githubUser}
                  setGithubUser={setGithubUser}
                  githubToken={githubToken}
                  setGithubToken={setGithubToken}
                  files={files}
                  onImportFiles={handleImportFiles}
                  currentRepoName={currentRepoName}
                  setCurrentRepoName={setCurrentRepoName}
                />
              )}
              {rightTab === 'vercel' && (
                <VercelHub
                  vercelUser={vercelUser}
                  setVercelUser={setVercelUser}
                  vercelToken={vercelToken}
                  setVercelToken={setVercelToken}
                  files={files}
                  projectName={projectName}
                  lastDeployment={lastDeployment}
                  setLastDeployment={setLastDeployment}
                />
              )}
              {rightTab === 'supabase' && (
                <SupabaseHub
                  supabaseConfig={supabaseConfig}
                  setSupabaseConfig={setSupabaseConfig}
                  onInjectSupabaseFiles={handleInjectSupabaseFiles}
                />
              )}
              {rightTab === 'architecture' && <ArchitectureHub />}
            </div>
          </div>

          {/* Desktop High Density Status Footer */}
          <footer className="h-6 bg-[#0F1115] border-t border-[#2D3139] flex items-center justify-between px-3 text-[10px] text-gray-500 font-mono select-none shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-gray-400">-- SYSTEM OK --</span>
              <span className={`flex items-center gap-1.5 ${supabaseConfig.isConnected ? 'text-emerald-400' : 'text-gray-500'}`}>
                <span className={`status-dot ${supabaseConfig.isConnected ? 'status-online' : 'bg-gray-600'}`} />
                supabase-{supabaseConfig.isConnected ? 'connected' : 'idle'}
              </span>
              <span className={`flex items-center gap-1.5 ${githubUser ? 'text-blue-400' : 'text-gray-500'}`}>
                <span className={`status-dot ${githubUser ? 'status-online bg-blue-500' : 'bg-gray-600'}`} />
                github-push-{githubUser ? 'enabled' : 'ready'}
              </span>
              <span className="hidden sm:inline text-gray-700">|</span>
              <span className="hidden sm:inline text-gray-400 font-mono">{projectName}</span>
            </div>
            <div className="flex items-center gap-3">
              <span>UTF-8</span>
              <span>{files.length} virtual files</span>
              <span className="text-blue-400 hidden lg:inline">{activeFilePath}</span>
            </div>
          </footer>
        </div>
      )}
    </>
  )}

      {/* 3-Lines Palette & Hamburger Drawer Menu */}
      <PaletteDrawerMenu
        isOpen={isPaletteDrawerOpen}
        onClose={() => setIsPaletteDrawerOpen(false)}
        activeAppView={activeAppView}
        onSelectAppView={handleSelectAppView}
        viewMode={viewMode}
        onToggleViewMode={() => setViewMode((m) => (m === 'mobile' ? 'desktop' : 'mobile'))}
        currentUser={currentUser}
        onOpenAuthModal={() => handleOpenAuthModal('free')}
        onLogout={handleLogout}
        onOpenProjectPalette={() => setIsProjectPaletteOpen(true)}
        onOpenSettings={(tab) => handleOpenSettingsTab((tab as any) || 'chat')}
        savedProjects={savedProjects}
        currentProjectId={currentProjectId}
        onSelectProject={handleSelectProject}
        onCreateNewProject={handleCreateNewProject}
      />

      {/* Real User Registration & Login Modal */}
      <RegistrationModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialPlan={authModalPlan}
        onSuccess={handleUserRegister}
      />

      {/* Mobile 4-Tile Action Sheet (Screenshot 4) */}
      <MobileActionSheet
        isOpen={isActionSheetOpen}
        onClose={() => setIsActionSheetOpen(false)}
        onRemix={handleDownloadZip}
        onReloadApp={() => setReloadTrigger((prev) => prev + 1)}
        onSharing={() => handleOpenSettingsTab('publish')}
        onOpenSettings={() => handleOpenSettingsTab('chat')}
        onOpenCode={() => setMobileTab('code')}
        onOpenProjectPalette={() => setIsProjectPaletteOpen(true)}
        isLandingActive={isLandingActive}
        onLoadLandingPage={handleLoadLandingPage}
      />

      {/* Project & Starter Templates Palette Modal (Command+K) */}
      <ProjectPaletteModal
        isOpen={isProjectPaletteOpen}
        onClose={() => setIsProjectPaletteOpen(false)}
        currentProjectId={currentProjectId}
        currentProjectName={projectName}
        savedProjects={savedProjects}
        onSelectProject={handleSelectProject}
        onSelectTemplate={handleSelectTemplate}
        onCreateNewProject={handleCreateNewProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
      />

      {/* Full Settings & Integrations Modal (Screenshots 2 & 3) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        initialTab={settingsTab}
        llmConfig={llmConfig}
        setLlmConfig={setLlmConfig}
        systemPrompt={systemPrompt}
        setSystemPrompt={setSystemPrompt}
        githubUser={githubUser}
        setGithubUser={setGithubUser}
        githubToken={githubToken}
        setGithubToken={setGithubToken}
        currentRepoName={currentRepoName}
        setCurrentRepoName={setCurrentRepoName}
        onImportFiles={handleImportFiles}
        projectName={projectName}
        vercelUser={vercelUser}
        supabaseConfig={supabaseConfig}
        setSupabaseConfig={setSupabaseConfig}
        onOpenPushModal={() => {
          setIsSettingsModalOpen(false);
          setRightTab('github');
          setMobileTab('chat');
        }}
        onOpenDeployModal={() => {
          setIsSettingsModalOpen(false);
          setRightTab('vercel');
          setMobileTab('chat');
        }}
        files={files}
        onRestoreCheckpoint={handleRestoreCheckpoint}
      />

      {/* Floating System Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200 border border-emerald-400/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-100 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
