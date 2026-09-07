import React from 'react';
import {
  X,
  Sparkles,
  Layout,
  Code2,
  FolderKanban,
  User,
  LogOut,
  Smartphone,
  Monitor,
  ExternalLink,
  ChevronRight,
  Database,
  Cloud,
  Github,
  Plus,
  Crown,
  Settings,
} from 'lucide-react';
import { AppUser, SavedProject, ProjectTemplate } from '../types';

interface PaletteDrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeAppView: 'landing' | 'studio';
  onSelectAppView: (view: 'landing' | 'studio') => void;
  viewMode: 'mobile' | 'desktop';
  onToggleViewMode: () => void;
  currentUser: AppUser | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
  onOpenProjectPalette: () => void;
  onOpenSettings: (tab?: string) => void;
  savedProjects: SavedProject[];
  currentProjectId: string;
  onSelectProject: (project: SavedProject) => void;
  onCreateNewProject: () => void;
}

export function PaletteDrawerMenu({
  isOpen,
  onClose,
  activeAppView,
  onSelectAppView,
  viewMode,
  onToggleViewMode,
  currentUser,
  onOpenAuthModal,
  onLogout,
  onOpenProjectPalette,
  onOpenSettings,
  savedProjects,
  currentProjectId,
  onSelectProject,
  onCreateNewProject,
}: PaletteDrawerMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Canvas */}
      <div className="relative w-full max-w-xs sm:max-w-sm bg-[#11141A] border-r border-[#262B36] text-[#E2E8F0] h-full shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-left duration-200">
        {/* Top Header */}
        <div className="p-4 border-b border-[#202530] flex items-center justify-between bg-gradient-to-r from-blue-950/40 via-[#151922] to-[#11141A]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-md">
              <Sparkles className="w-4 h-4 fill-blue-400" />
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight text-white font-mono flex items-center gap-1.5">
                WEBAI.STUDIO
                <span className="text-[10px] px-1.5 py-0.2 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-full font-sans">
                  PRO
                </span>
              </div>
              <div className="text-[10.5px] text-gray-400">Menú de Paleta & Navegación</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar menú (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Status Bar */}
        <div className="p-3 bg-[#161B24] border-b border-[#222834] flex items-center justify-between">
          {currentUser ? (
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full border border-blue-500/40 shrink-0 bg-blue-950"
              />
              <div className="min-w-0">
                <div className="text-xs font-semibold text-white truncate flex items-center gap-1">
                  <span>{currentUser.name}</span>
                  {currentUser.plan === 'pro' && (
                    <span className="text-[9px] px-1 py-0.2 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded font-mono">
                      PRO
                    </span>
                  )}
                  {currentUser.plan === 'team' && (
                    <span className="text-[9px] px-1 py-0.2 bg-purple-500/20 border border-purple-500/40 text-purple-300 rounded font-mono">
                      TEAM
                    </span>
                  )}
                </div>
                <div className="text-[10.5px] text-gray-400 truncate font-mono">{currentUser.email}</div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
                  <User className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-300">Modo Visitante</div>
                  <div className="text-[10px] text-gray-500">Sin cuenta iniciada</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenAuthModal();
                }}
                className="px-2.5 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Registrarse
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs font-medium">
          {/* 1. Main Views Switcher */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-2 mb-1.5">
              Vistas de la Plataforma
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onSelectAppView('landing');
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  activeAppView === 'landing'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-sm'
                    : 'text-gray-300 hover:bg-[#181D26] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Layout className="w-4 h-4 text-blue-400" />
                  <div className="text-left">
                    <div className="font-semibold text-xs">Landing Page Oficial</div>
                    <div className="text-[10px] text-gray-400">Página de captación, anuncios y registro</div>
                  </div>
                </div>
                {activeAppView === 'landing' && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 shadow-sm" />
                )}
              </button>

              <button
                onClick={() => {
                  onSelectAppView('studio');
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-2 rounded-xl transition-all ${
                  activeAppView === 'studio'
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-sm'
                    : 'text-gray-300 hover:bg-[#181D26] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Code2 className="w-4 h-4 text-indigo-400" />
                  <div className="text-left">
                    <div className="font-semibold text-xs">Studio IDE & Workspace</div>
                    <div className="text-[10px] text-gray-400">Editor en vivo, chat y preview activo</div>
                  </div>
                </div>
                {activeAppView === 'studio' && (
                  <span className="w-2 h-2 rounded-full bg-indigo-400 shadow-sm" />
                )}
              </button>
            </div>
          </div>

          {/* 2. Device View Toggle */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-2 mb-1.5">
              Simulador de Dispositivo
            </div>
            <button
              onClick={() => {
                onToggleViewMode();
                onClose();
              }}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-[#161B24] border border-[#232834] text-gray-300 hover:text-white hover:border-gray-600 transition-all"
            >
              <div className="flex items-center gap-2.5">
                {viewMode === 'mobile' ? (
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Monitor className="w-4 h-4 text-blue-400" />
                )}
                <div className="text-left">
                  <div className="font-semibold text-xs">
                    {viewMode === 'mobile' ? 'Vista Móvil (Google AI Studio)' : 'Vista Escritorio (3 Columnas)'}
                  </div>
                  <div className="text-[10px] text-gray-400">Clic para alternar simulación</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>

          {/* 3. Projects & Templates Palette */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                Proyectos & Plantillas
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenProjectPalette();
                }}
                className="text-[10.5px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
              >
                <span>Ver todas</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => {
                  onClose();
                  onOpenProjectPalette();
                }}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border border-blue-500/30 text-blue-200 hover:bg-blue-900/30 transition-all"
              >
                <div className="flex items-center gap-2">
                  <FolderKanban className="w-4 h-4 text-blue-400" />
                  <span className="font-semibold text-xs">Abrir Paleta de Proyectos</span>
                </div>
                <kbd className="px-1.5 py-0.5 text-[9px] bg-[#0E1116] rounded border border-gray-700 text-gray-400 font-mono">
                  ⌘K
                </kbd>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCreateNewProject();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-xl text-gray-300 hover:bg-[#181D26] hover:text-white transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Crear Nuevo Proyecto en Blanco</span>
              </button>

              {/* Saved Projects list */}
              <div className="pt-1 space-y-1">
                {savedProjects.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      onSelectAppView('studio');
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-all ${
                      currentProjectId === p.id
                        ? 'bg-blue-600/15 border border-blue-500/40 text-blue-300'
                        : 'text-gray-400 hover:bg-[#161B24] hover:text-gray-200'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="font-mono text-xs truncate text-gray-200">{p.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{p.description || 'Proyecto guardado'}</div>
                    </div>
                    {currentProjectId === p.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Cloud Integrations Hub */}
          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-500 px-2 mb-1.5">
              Integraciones & Nube
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => {
                  onClose();
                  onSelectAppView('studio');
                  onOpenSettings('github');
                }}
                className="p-2 rounded-xl bg-[#161B24] border border-[#232834] hover:border-gray-600 text-center transition-all flex flex-col items-center gap-1"
              >
                <Github className="w-4 h-4 text-gray-300" />
                <span className="text-[10.5px] font-mono text-gray-300">GitHub</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectAppView('studio');
                  onOpenSettings('publish');
                }}
                className="p-2 rounded-xl bg-[#161B24] border border-[#232834] hover:border-gray-600 text-center transition-all flex flex-col items-center gap-1"
              >
                <Cloud className="w-4 h-4 text-blue-400" />
                <span className="text-[10.5px] font-mono text-gray-300">Vercel</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onSelectAppView('studio');
                  onOpenSettings('supabase');
                }}
                className="p-2 rounded-xl bg-[#161B24] border border-[#232834] hover:border-gray-600 text-center transition-all flex flex-col items-center gap-1"
              >
                <Database className="w-4 h-4 text-emerald-400" />
                <span className="text-[10.5px] font-mono text-gray-300">Supabase</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-[#202530] bg-[#0E1116] space-y-2">
          {currentUser ? (
            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 p-2 rounded-xl bg-red-950/30 hover:bg-red-950/60 border border-red-900/40 text-red-300 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onOpenAuthModal();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Crear Cuenta Gratis</span>
            </button>
          )}

          <div className="text-[10px] text-gray-500 text-center font-mono pt-1">
            Web AI Studio • Full-Stack Engine
          </div>
        </div>
      </div>
    </div>
  );
}
