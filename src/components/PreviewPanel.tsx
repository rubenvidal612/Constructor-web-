import React, { useState, useEffect, useRef } from 'react';
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  ExternalLink,
  Terminal,
  Lock,
  Copy,
  Check,
  SmartphoneNfc,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';
import { VirtualFile } from '../types';
import { buildPreviewHtml } from '../utils/bundler';

interface PreviewPanelProps {
  files: VirtualFile[];
  reloadTrigger?: number;
  isLandingActive?: boolean;
  onLoadLandingPage?: () => void;
}

interface ConsoleLogItem {
  id: string;
  level: 'log' | 'warn' | 'error';
  message: string;
  time: string;
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  files,
  reloadTrigger = 0,
  isLandingActive = false,
  onLoadLandingPage,
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [scale, setScale] = useState<number>(1);
  const [showFrame, setShowFrame] = useState<boolean>(true);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [showConsole, setShowConsole] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [consoleLogs, setConsoleLogs] = useState<ConsoleLogItem[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (reloadTrigger > 0) {
      setReloadKey((k) => k + 1);
    }
  }, [reloadTrigger]);

  // Generate bundled HTML string
  const bundledHtml = buildPreviewHtml(files);

  // Listen to console messages dispatched from within the iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'PREVIEW_CONSOLE_LOG') {
        setConsoleLogs((prev) => [
          ...prev.slice(-49), // retain last 50 logs
          {
            id: Math.random().toString(36).substring(7),
            level: event.data.level || 'log',
            message: event.data.message || '',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleOpenNewTab = () => {
    const blob = new Blob([bundledHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText('https://preview.webai.studio/app');
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Viewport dimensions calculation
  const getDeviceDimensions = () => {
    if (viewport === 'desktop') {
      return { width: '100%', height: '100%', isFluid: true };
    }
    if (viewport === 'tablet') {
      return orientation === 'portrait'
        ? { width: '768px', height: '1024px', isFluid: false }
        : { width: '1024px', height: '768px', isFluid: false };
    }
    // mobile
    return orientation === 'portrait'
      ? { width: '375px', height: '760px', isFluid: false }
      : { width: '760px', height: '375px', isFluid: false };
  };

  const device = getDeviceDimensions();

  return (
    <div
      className={`flex flex-col h-full bg-[#14171F] select-none overflow-hidden font-sans ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#0A0C10]' : ''
      }`}
    >
      {/* Viewport Toolbar */}
      <div className="h-10 border-b border-[#252A34] bg-[#0E1015] px-3 flex items-center justify-between shrink-0 gap-2">
        {/* Device Switcher */}
        <div className="flex items-center gap-1 bg-[#181C24] p-0.5 rounded-lg border border-[#2A303D]">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              viewport === 'desktop'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#202532]'
            }`}
            title="Escritorio (100% fluido)"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Escritorio</span>
          </button>

          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              viewport === 'tablet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#202532]'
            }`}
            title="Tablet (768 × 1024 px)"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Tablet</span>
          </button>

          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-all ${
              viewport === 'mobile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-gray-200 hover:bg-[#202532]'
            }`}
            title="Móvil (375 × 760 px)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Móvil</span>
          </button>
        </div>

        {/* Orientation & Frame toggles for non-desktop */}
        {viewport !== 'desktop' && (
          <div className="flex items-center gap-1 bg-[#181C24] p-0.5 rounded-lg border border-[#2A303D]">
            <button
              onClick={() => setOrientation((prev) => (prev === 'portrait' ? 'landscape' : 'portrait'))}
              className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-gray-300 hover:text-white hover:bg-[#202532] transition-colors"
              title="Girar orientación (Vertical / Horizontal)"
            >
              <RotateCw className="w-3 h-3 text-blue-400" />
              <span className="text-[11px] font-mono capitalize">{orientation === 'portrait' ? 'Vertical' : 'Horizontal'}</span>
            </button>

            <button
              onClick={() => setShowFrame(!showFrame)}
              className={`p-1 rounded-md text-xs transition-colors ${
                showFrame ? 'text-blue-400 bg-blue-500/10' : 'text-gray-400 hover:text-white'
              }`}
              title="Alternar marco exterior del dispositivo"
            >
              <SmartphoneNfc className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Scale & Zoom dropdown */}
        <div className="hidden xl:flex items-center gap-1 text-[11px] font-mono text-gray-400">
          <span className="text-gray-500">Escala:</span>
          <select
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            className="bg-[#181C24] border border-[#2A303D] text-gray-300 rounded px-1.5 py-0.5 text-[11px] focus:outline-none focus:border-blue-500"
          >
            <option value={1}>100%</option>
            <option value={0.85}>85%</option>
            <option value={0.75}>75%</option>
            <option value={0.65}>65%</option>
          </select>
        </div>

        {/* Action icons (Console, Refresh, Open New Tab) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowConsole(!showConsole)}
            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono transition-all ${
              showConsole
                ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                : 'text-gray-400 hover:text-white hover:bg-[#181C24] border border-transparent'
            }`}
            title="Consola de depuración y registros"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Consola</span>
            {consoleLogs.length > 0 && (
              <span className="text-[9px] px-1 rounded-full bg-[#181C24] text-gray-300 border border-[#2A303D]">
                {consoleLogs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 rounded-lg hover:bg-[#181C24] text-gray-400 hover:text-white transition-all"
            title="Recargar vista previa"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenNewTab}
            className="p-1.5 rounded-lg hover:bg-[#181C24] text-gray-400 hover:text-white transition-all"
            title="Abrir en pestaña independiente"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-1.5 rounded-lg transition-all ${
              isFullscreen
                ? 'bg-blue-600 text-white shadow-sm'
                : 'hover:bg-[#181C24] text-gray-400 hover:text-white'
            }`}
            title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Ver en pantalla completa'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Simulated Browser URL bar */}
      <div className="h-7 bg-[#101218] border-b border-[#202530] px-3 flex items-center justify-between text-[11px] text-gray-400 shrink-0 gap-2">
        <div className="flex items-center gap-2 flex-1 max-w-lg bg-[#161922] px-2.5 py-0.5 rounded-full border border-[#242A35]">
          <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
          <span className="font-mono text-[10.5px] text-gray-300 truncate">https://preview.webai.studio/app</span>
          <button
            onClick={handleCopyUrl}
            className="ml-auto hover:text-white text-gray-500"
            title="Copiar URL"
          >
            {copiedUrl ? <Check className="w-2.5 h-2.5 text-emerald-400" /> : <Copy className="w-2.5 h-2.5" />}
          </button>
        </div>

        {/* Quick Landing Page Switcher or Active Pill */}
        {onLoadLandingPage && !isLandingActive && (
          <button
            onClick={onLoadLandingPage}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600/25 to-indigo-600/25 hover:from-blue-600/40 hover:to-indigo-600/40 border border-blue-500/40 text-blue-300 hover:text-white text-[10.5px] font-semibold transition-all shrink-0 shadow-sm cursor-pointer"
            title="Haz clic para cargar la Landing Page Ultra-Interactiva en el visor"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Ver Landing Page</span>
          </button>
        )}
        {isLandingActive && (
          <span className="hidden sm:flex items-center gap-1 text-[10px] text-blue-300 font-medium bg-blue-900/25 px-2 py-0.5 rounded-full border border-blue-500/40 shrink-0">
            <Sparkles className="w-2.5 h-2.5 text-amber-400" />
            <span>Landing Page Activa</span>
          </span>
        )}

        <div className="flex items-center gap-3 text-[10.5px] text-gray-500 font-mono shrink-0">
          <span className="hidden md:inline">HTML5 + Tailwind</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 overflow-auto bg-[#0A0C10] flex items-center justify-center p-3 relative">
        <div
          style={{
            width: device.width,
            height: device.height,
            transform: scale !== 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
          }}
          className={`transition-all duration-200 flex flex-col ${
            device.isFluid
              ? 'w-full h-full bg-[#16191E] border border-[#252A34] rounded-lg overflow-hidden shadow-2xl'
              : showFrame
              ? 'bg-[#1A1D24] p-3 rounded-[36px] shadow-2xl border-4 border-[#2D3342] relative'
              : 'bg-[#16191E] border border-[#252A34] rounded-lg overflow-hidden shadow-2xl'
          }`}
        >
          {/* Simulated Mobile Speaker & Camera Bezel */}
          {!device.isFluid && showFrame && (
            <div className="w-full flex items-center justify-center pb-2 pt-0.5 shrink-0 select-none">
              <div className="h-3.5 w-24 bg-[#12141A] rounded-full border border-[#252A35] flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-black/80" />
                <div className="w-8 h-1 rounded-full bg-gray-700/60" />
              </div>
            </div>
          )}

          {/* Iframe Viewport */}
          <div className="flex-1 w-full h-full rounded-2xl overflow-hidden bg-white shadow-inner relative">
            <iframe
              key={reloadKey}
              ref={iframeRef}
              srcDoc={bundledHtml}
              title="Virtual Web Preview"
              sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
              className="w-full h-full border-0 bg-white"
            />
          </div>

          {/* Simulated Mobile Bottom Home Bar */}
          {!device.isFluid && showFrame && (
            <div className="w-full flex items-center justify-center pt-2 pb-0.5 shrink-0 select-none">
              <div className="w-28 h-1 rounded-full bg-gray-600/70" />
            </div>
          )}
        </div>
      </div>

      {/* Console Drawer */}
      {showConsole && (
        <div className="h-40 border-t border-[#252A34] bg-[#0E1015] font-mono text-[11px] flex flex-col shrink-0">
          <div className="h-7 px-3 bg-[#14171F] border-b border-[#252A34] flex items-center justify-between text-gray-400">
            <div className="flex items-center gap-2">
              <span className="font-bold uppercase tracking-wider text-[10px] text-gray-300">REGISTROS DE CONSOLA</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#1C202B] text-gray-400 border border-[#2A303D]">
                {consoleLogs.length} eventos
              </span>
            </div>
            <button
              onClick={() => setConsoleLogs([])}
              className="text-[10px] hover:text-white text-gray-500 font-semibold px-2 py-0.5 rounded hover:bg-[#1E222D] transition-colors"
            >
              LIMPIAR
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {consoleLogs.length === 0 ? (
              <div className="text-gray-600 text-center py-6 text-xs font-mono">
                No hay registros de consola activos.
              </div>
            ) : (
              consoleLogs.map((log) => (
                <div
                  key={log.id}
                  className={`flex items-start gap-2 px-2 py-1 rounded text-xs leading-relaxed ${
                    log.level === 'error'
                      ? 'bg-rose-950/30 text-rose-300 border border-rose-900/40'
                      : log.level === 'warn'
                      ? 'bg-amber-950/30 text-amber-300 border border-amber-900/40'
                      : 'text-gray-300 hover:bg-[#181C25]'
                  }`}
                >
                  <span className="text-gray-600 text-[10px] shrink-0 mt-0.5 font-mono">{log.time}</span>
                  <span className="break-all font-mono">{log.message}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
