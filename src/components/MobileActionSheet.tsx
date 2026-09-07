import React from 'react';
import { ArrowUpRight, RotateCw, Users, Settings, X, Download, GitBranch, FolderKanban, Sparkles } from 'lucide-react';

interface MobileActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onRemix: () => void;
  onReloadApp: () => void;
  onSharing: () => void;
  onOpenSettings: () => void;
  onOpenCode?: () => void;
  onOpenProjectPalette?: () => void;
  isLandingActive?: boolean;
  onLoadLandingPage?: () => void;
}

export const MobileActionSheet: React.FC<MobileActionSheetProps> = ({
  isOpen,
  onClose,
  onRemix,
  onReloadApp,
  onSharing,
  onOpenSettings,
  onOpenCode,
  onOpenProjectPalette,
  isLandingActive = false,
  onLoadLandingPage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="mobile-action-sheet-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        id="mobile-action-sheet-panel"
        className="bg-[#16191E] border-t border-[#2D3139] rounded-t-2xl p-4 sm:p-5 pb-8 shadow-2xl animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-4 opacity-60" />

        {/* Quick Landing Page Action Button */}
        {onLoadLandingPage && (
          <div className="mb-3">
            <button
              onClick={() => {
                onClose();
                onLoadLandingPage();
              }}
              className={`w-full py-2.5 px-4 rounded-xl border text-white text-xs font-bold flex items-center justify-between shadow-md transition-all ${
                isLandingActive
                  ? 'bg-blue-600/30 border-blue-500/50 text-blue-200'
                  : 'bg-gradient-to-r from-blue-600/35 to-indigo-600/35 border-blue-500/50 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isLandingActive ? '⭐ Landing Page Ultra-Interactiva (Activa)' : '🚀 Ver Landing Page Ultra-Interactiva'}</span>
              </div>
              <span className="text-[10px] font-mono text-blue-300 underline">
                {isLandingActive ? 'Ver Preview' : 'Cargar &rarr;'}
              </span>
            </button>
          </div>
        )}

        {onOpenProjectPalette && (
          <div className="mb-4">
            <button
              onClick={() => {
                onClose();
                onOpenProjectPalette();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-900/40 via-indigo-900/40 to-purple-900/40 border border-blue-500/40 text-white text-xs font-bold flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-400" />
                <span>Plantillas & Mis Proyectos</span>
              </div>
              <span className="text-[10px] font-mono text-blue-300">Explorar &rarr;</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2.5 sm:gap-4">
          {/* 1. Remix */}
          <button
            id="mobile-action-remix"
            onClick={() => {
              onClose();
              onRemix();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E2227] hover:bg-[#252A32] active:bg-[#2C323D] border border-[#2D3139] text-gray-200 transition-all gap-2"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-blue-400">
              <ArrowUpRight className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-300">Remix</span>
          </button>

          {/* 2. Reload App */}
          <button
            id="mobile-action-reload"
            onClick={() => {
              onClose();
              onReloadApp();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E2227] hover:bg-[#252A32] active:bg-[#2C323D] border border-[#2D3139] text-gray-200 transition-all gap-2"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-emerald-400">
              <RotateCw className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-300">Reload app</span>
          </button>

          {/* 3. Sharing */}
          <button
            id="mobile-action-sharing"
            onClick={() => {
              onClose();
              onSharing();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E2227] hover:bg-[#252A32] active:bg-[#2C323D] border border-[#2D3139] text-gray-200 transition-all gap-2"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-300">Sharing</span>
          </button>

          {/* 4. Settings */}
          <button
            id="mobile-action-settings"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E2227] hover:bg-[#252A32] active:bg-[#2C323D] border border-[#2D3139] text-gray-200 transition-all gap-2"
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-gray-400">
              <Settings className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-gray-300">Settings</span>
          </button>
        </div>

        {onOpenCode && (
          <div className="mt-4 pt-3 border-t border-[#242830] flex justify-center">
            <button
              onClick={() => {
                onClose();
                onOpenCode();
              }}
              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1.5 py-1 px-3 rounded-lg bg-[#1E2227] border border-[#2D3139]"
            >
              <span>Browse code files in Editor</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
