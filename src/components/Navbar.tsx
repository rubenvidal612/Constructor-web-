import React from 'react';
import {
  Github,
  Cloud,
  Database,
  ExternalLink,
  Download,
  BookOpen,
  Eye,
  GitBranch,
  Rocket,
  Layers,
  Sparkles,
  FolderKanban,
  ChevronDown,
  Menu,
  Layout,
  User,
} from 'lucide-react';
import { GitHubUser, VercelUser, SupabaseConfig, AppUser } from '../types';

interface NavbarProps {
  projectName: string;
  setProjectName: (name: string) => void;
  githubUser: GitHubUser | null;
  vercelUser: VercelUser | null;
  supabaseConfig: SupabaseConfig;
  rightTab: 'preview' | 'github' | 'vercel' | 'supabase' | 'architecture';
  setRightTab: (tab: 'preview' | 'github' | 'vercel' | 'supabase' | 'architecture') => void;
  onOpenPushModal: () => void;
  onOpenDeployModal: () => void;
  onDownloadZip: () => void;
  onOpenProjectPalette?: () => void;
  hasUncommittedChanges: boolean;
  isLandingActive?: boolean;
  onLoadLandingPage?: () => void;
  onOpenPaletteMenu?: () => void;
  onSelectAppView?: (view: 'landing' | 'studio') => void;
  currentUser?: AppUser | null;
  onOpenAuthModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  projectName,
  setProjectName,
  githubUser,
  vercelUser,
  supabaseConfig,
  rightTab,
  setRightTab,
  onOpenPushModal,
  onOpenDeployModal,
  onDownloadZip,
  onOpenProjectPalette,
  hasUncommittedChanges,
  isLandingActive = false,
  onLoadLandingPage,
  onOpenPaletteMenu,
  onSelectAppView,
  currentUser,
  onOpenAuthModal,
}) => {
  return (
    <header className="h-12 border-b border-[#2D3139] bg-[#16191E] flex items-center justify-between px-3 sm:px-4 z-20 shrink-0 select-none">
      {/* Brand & Project Breadcrumb */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* 3-Horizontal Lines Hamburger Menu Button */}
        <button
          onClick={onOpenPaletteMenu}
          className="p-1.5 rounded-lg bg-[#191D25] hover:bg-[#232935] border border-[#2B303C] text-gray-300 hover:text-white transition-all shadow-sm flex items-center gap-1.5 cursor-pointer group"
          title="Abrir Menú de Paleta (3 líneas)"
          id="navbar-hamburger-btn"
        >
          <Menu className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="hidden xl:inline text-xs font-semibold text-gray-200">Menú</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center font-bold text-xs text-white shadow-sm shadow-blue-500/30">
            W
          </div>
          <span className="font-semibold text-sm tracking-tight text-white font-mono hidden sm:inline">
            WEBAI.STUDIO
          </span>
        </div>

        <div className="h-4 w-[1px] bg-gray-700 hidden sm:block"></div>

        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
          <button
            onClick={onOpenProjectPalette}
            className="flex items-center gap-1 hover:text-white px-2 py-1 rounded-lg bg-[#181C23] hover:bg-[#1F242F] border border-[#2B303C] text-gray-200 transition-all font-semibold text-xs shadow-sm cursor-pointer"
            title="Abrir menú de proyectos y plantillas (⌘K)"
          >
            <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Mis Proyectos</span>
            <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
          </button>
          <span className="text-gray-600 hidden sm:inline">/</span>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent hover:bg-[#1E2227] focus:bg-[#1E2227] px-1.5 py-0.5 rounded text-white font-mono text-xs focus:outline-none focus:border focus:border-[#2D3139] w-28 sm:w-36 transition-all"
            title="Haz clic para renombrar el proyecto"
          />
          <span className="bg-[#1E2227] px-1.5 py-0.5 rounded text-[10px] text-blue-400 border border-blue-900/40 font-mono hidden sm:inline">
            main
          </span>
          {hasUncommittedChanges && (
            <span className="status-dot bg-amber-400 animate-pulse ml-1" title="Cambios sin confirmar" />
          )}

          {/* Quick Landing Page Switcher in Navbar */}
          {onSelectAppView && (
            <button
              onClick={() => onSelectAppView('landing')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-900/30 to-indigo-900/30 hover:from-blue-900/50 hover:to-indigo-900/50 text-blue-300 border border-blue-500/30 text-[11px] font-semibold transition-all ml-1 cursor-pointer"
              title="Ir a la Landing Page pública de la plataforma"
            >
              <Layout className="w-3 h-3 text-blue-400" />
              <span className="hidden md:inline">Landing Page</span>
            </button>
          )}

          {onLoadLandingPage && (
            <button
              onClick={onLoadLandingPage}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ml-1 cursor-pointer ${
                isLandingActive
                  ? 'bg-blue-600/25 text-blue-300 border border-blue-500/50 shadow-sm'
                  : 'bg-[#191D25] hover:bg-[#222733] border border-[#2B303C] text-gray-300 hover:text-white'
              }`}
              title={isLandingActive ? 'Landing Page activa en la vista previa' : 'Cargar la Landing Page Ultra-Interactiva'}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>{isLandingActive ? 'Landing Page' : 'Ver Landing'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Center navigation tabs for right workspace views */}
      <div className="flex items-center gap-1 bg-[#0F1115] p-0.5 rounded-md border border-[#2D3139]">
        <button
          onClick={() => setRightTab('preview')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            rightTab === 'preview'
              ? 'bg-[#1E2227] text-white border border-[#2D3139] shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]/50'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>Vista previa</span>
        </button>

        <button
          onClick={() => setRightTab('github')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            rightTab === 'github'
              ? 'bg-[#1E2227] text-white border border-[#2D3139] shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]/50'
          }`}
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
          {githubUser && <span className="status-dot status-online ml-0.5" />}
        </button>

        <button
          onClick={() => setRightTab('vercel')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            rightTab === 'vercel'
              ? 'bg-[#1E2227] text-white border border-[#2D3139] shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]/50'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Vercel</span>
          {vercelUser && <span className="status-dot status-online ml-0.5" />}
        </button>

        <button
          onClick={() => setRightTab('supabase')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            rightTab === 'supabase'
              ? 'bg-[#1E2227] text-white border border-[#2D3139] shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]/50'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Supabase</span>
          {supabaseConfig.isConnected && <span className="status-dot status-online ml-0.5" />}
        </button>

        <button
          onClick={() => setRightTab('architecture')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
            rightTab === 'architecture'
              ? 'bg-blue-950/40 text-blue-300 border border-blue-500/40 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]/50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Detalles</span>
        </button>
      </div>

      {/* Action Buttons & Status Indicators */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* High-density status indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1E2227] border border-[#2D3139] text-xs">
          <span className="status-dot status-online"></span>
          <span className="text-gray-400">Vercel:</span>
          <span className="text-white font-mono text-[11px]">
            {vercelUser ? 'CONECTADO' : 'LISTO'}
          </span>
        </div>

        <button
          onClick={onDownloadZip}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1E2227] hover:bg-[#252a32] border border-[#2D3139] text-gray-200 hover:text-white text-xs font-semibold transition-colors shadow-sm"
          title="Descargar proyecto completo en ZIP listo para ejecutar"
        >
          <Download className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Exportar ZIP</span>
          <span className="sm:hidden text-[11px]">ZIP</span>
        </button>

        <button
          onClick={onOpenPushModal}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded transition-colors flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Guardar en GitHub</span>
        </button>

        <button
          onClick={onOpenDeployModal}
          className="bg-[#1E2227] hover:bg-[#252a32] border border-[#2D3139] text-white text-xs font-semibold px-2.5 py-1.5 rounded transition-colors flex items-center gap-1.5"
        >
          <Rocket className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden sm:inline">Desplegar</span>
        </button>

        {currentUser ? (
          <button
            onClick={onOpenPaletteMenu}
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 bg-[#1A1F2B] border border-[#2B3448] hover:border-blue-500 rounded-full text-xs transition-all cursor-pointer"
            title="Ver perfil y menú de usuario"
          >
            <img
              src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
              alt={currentUser.name}
              className="w-5 h-5 rounded-full object-cover"
            />
            <span className="text-white font-medium text-[11px] hidden sm:inline max-w-[90px] truncate">
              {currentUser.name}
            </span>
          </button>
        ) : (
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Crear cuenta o iniciar sesión"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Registrarse</span>
          </button>
        )}
      </div>
    </header>
  );
};
