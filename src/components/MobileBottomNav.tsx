import React from 'react';
import { ArrowLeft, MoreHorizontal, MessageSquare, Eye, Code2, Menu } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'chat' | 'preview' | 'code';
  setActiveTab: (tab: 'chat' | 'preview' | 'code') => void;
  onOpenMenu: () => void;
  onBack?: () => void;
  onOpenPaletteMenu?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMenu,
  onBack,
  onOpenPaletteMenu,
}) => {
  return (
    <nav
      id="mobile-bottom-nav"
      className="h-14 bg-[#0F1115] border-t border-[#242830] px-3 flex items-center justify-between shrink-0 select-none z-30 pb-safe w-full"
    >
      {/* Left: 3-lines Hamburger Palette Menu */}
      <button
        id="mobile-nav-menu-btn"
        onClick={onOpenPaletteMenu || onBack || (() => setActiveTab('chat'))}
        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#1E2227] active:bg-[#252A32] transition-colors"
        aria-label="Menú de Paleta"
        title="Abrir Menú de Paleta (3 líneas)"
      >
        <Menu className="w-5 h-5 text-blue-400" />
      </button>

      {/* Center: Segmented Pill Switcher (Chat | Preview) matching Screenshot 1 */}
      <div className="flex items-center bg-[#1A1D24] p-1 rounded-full border border-[#2D3139] shadow-inner">
        <button
          id="mobile-tab-chat-btn"
          onClick={() => setActiveTab('chat')}
          className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeTab === 'chat'
              ? 'bg-[#373C47] text-white font-semibold shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </button>

        <button
          id="mobile-tab-preview-btn"
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 px-5 py-1.5 rounded-full text-xs font-medium transition-all ${
            activeTab === 'preview'
              ? 'bg-[#373C47] text-white font-semibold shadow-sm'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-blue-400" />
          <span>Preview</span>
        </button>

        {activeTab === 'code' && (
          <button
            id="mobile-tab-code-btn"
            onClick={() => setActiveTab('code')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#373C47] text-emerald-400 font-semibold shadow-sm"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code</span>
          </button>
        )}
      </div>

      {/* Right: Three Dots Action Menu */}
      <button
        id="mobile-nav-more-btn"
        onClick={onOpenMenu}
        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2227] active:bg-[#252A32] transition-colors"
        aria-label="More options"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </nav>
  );
};
