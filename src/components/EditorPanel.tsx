import React, { useState } from 'react';
import {
  Folder,
  File,
  FileCode,
  FileText,
  FileJson,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Columns2,
  Code,
  FolderTree,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { VirtualFile } from '../types';

interface EditorPanelProps {
  files: VirtualFile[];
  activeFilePath: string;
  setActiveFilePath: (path: string) => void;
  onFileChange: (path: string, newContent: string) => void;
  onCreateFile: (path: string) => void;
  onDeleteFile: (path: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  files,
  activeFilePath,
  setActiveFilePath,
  onFileChange,
  onCreateFile,
  onDeleteFile,
}) => {
  const [showExplorer, setShowExplorer] = useState(true);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [copied, setCopied] = useState(false);

  const activeFile = files.find((f) => f.path === activeFilePath) || files[0];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;
    onCreateFile(newFileName.trim());
    setNewFileName('');
    setIsCreatingFile(false);
  };

  const handleCopy = () => {
    if (!activeFile) return;
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileIcon = (path: string) => {
    if (path.endsWith('.html')) return <FileCode className="w-3.5 h-3.5 text-orange-400" />;
    if (path.endsWith('.js') || path.endsWith('.jsx')) return <FileCode className="w-3.5 h-3.5 text-yellow-400" />;
    if (path.endsWith('.ts') || path.endsWith('.tsx')) return <FileCode className="w-3.5 h-3.5 text-sky-400" />;
    if (path.endsWith('.json')) return <FileJson className="w-3.5 h-3.5 text-emerald-400" />;
    if (path.endsWith('.css')) return <FileCode className="w-3.5 h-3.5 text-indigo-400" />;
    if (path.endsWith('.md')) return <FileText className="w-3.5 h-3.5 text-slate-400" />;
    return <File className="w-3.5 h-3.5 text-slate-400" />;
  };

  const lineCount = activeFile?.content.split('\n').length || 1;

  return (
    <div className="flex h-full bg-[#0F1115] text-[#E2E8F0] select-none overflow-hidden">
      {/* File Tree Explorer (Left sub-panel, collapsible) */}
      {showExplorer && (
        <div className="w-36 sm:w-44 border-r border-[#2D3139] bg-[#0F1115] flex flex-col shrink-0 animate-in fade-in duration-100">
          {/* File tree header */}
          <div className="h-9 border-b border-[#2D3139] px-2 flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-gray-400 font-mono text-[10px] flex items-center gap-1">
              <FolderTree className="w-3 h-3 text-blue-400" />
              <span>EXPLORADOR</span>
            </span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => setIsCreatingFile(true)}
                className="p-1 hover:bg-[#1E2227] rounded text-gray-400 hover:text-white transition-all"
                title="Crear nuevo archivo"
              >
                <Plus className="w-3 h-3" />
              </button>
              <button
                onClick={() => setShowExplorer(false)}
                className="p-1 hover:bg-[#1E2227] rounded text-gray-400 hover:text-white transition-all"
                title="Ocultar explorador"
              >
                <PanelLeftClose className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* New file inline form */}
          {isCreatingFile && (
            <form onSubmit={handleCreateSubmit} className="p-1.5 border-b border-[#2D3139] bg-[#16191E]">
              <input
                type="text"
                placeholder="nombre_archivo.ext"
                autoFocus
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onBlur={() => !newFileName && setIsCreatingFile(false)}
                className="w-full bg-[#0F1115] border border-blue-500 rounded px-2 py-1 text-xs text-white font-mono focus:outline-none"
              />
            </form>
          )}

          {/* File list */}
          <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
            {files.map((file) => {
              const isActive = file.path === activeFile?.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setActiveFilePath(file.path)}
                  className={`group flex items-center justify-between px-2 py-1 cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-blue-500/10 text-blue-400 font-medium border-l-2 border-blue-500'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    {getFileIcon(file.path)}
                    <span className="truncate text-[11px] font-mono">{file.path}</span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {file.isModified && (
                      <span className="status-dot bg-amber-400" title="Modificado" />
                    )}
                    {file.isNew && (
                      <span className="text-[8px] px-1 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                        NUEVO
                      </span>
                    )}
                    {files.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteFile(file.path);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-red-400 transition-opacity"
                        title="Eliminar archivo"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Code Editor View (Right sub-panel) */}
      <div className="flex-1 flex flex-col min-w-[200px] bg-[#0F1115]">
        {/* Editor Tab Bar */}
        <div className="h-9 border-b border-[#2D3139] bg-[#16191E] flex items-center justify-between px-2 shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto scroll-hide py-0.5">
            {!showExplorer && (
              <button
                onClick={() => setShowExplorer(true)}
                className="flex items-center gap-1 px-1.5 py-1 rounded bg-[#1E2227] hover:bg-[#252A32] text-blue-400 hover:text-blue-300 border border-[#2D3139] text-[11px] font-mono mr-1 shrink-0 transition-colors"
                title="Mostrar Explorador de archivos"
              >
                <PanelLeftOpen className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Archivos</span>
              </button>
            )}
            {files.map((file) => {
              const isActive = file.path === activeFile?.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setActiveFilePath(file.path)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono transition-all shrink-0 rounded-t ${
                    isActive
                      ? 'bg-[#0F1115] text-white border-x border-t border-[#2D3139] font-medium'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1E2227]/60'
                  }`}
                >
                  {getFileIcon(file.path)}
                  <span className="text-[11px]">{file.path.split('/').pop()}</span>
                  {file.isModified && <span className="status-dot bg-amber-400 ml-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-[#1E2227] text-gray-400 hover:text-white transition-all"
              title="Copiar contenido del archivo"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Code Content Area with Line Numbers */}
        {activeFile ? (
          <div className="flex-1 flex min-h-0 relative font-mono text-xs bg-[#1E2227]">
            {/* Line numbers gutter */}
            <div className="w-10 select-none py-2 text-right pr-2 text-gray-500 bg-[#16191E] border-r border-[#2D3139] shrink-0 font-mono text-[11px] leading-6">
              {Array.from({ length: lineCount }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>

            {/* Editable code textarea */}
            <div className="flex-1 relative overflow-hidden bg-[#1E2227]">
              <textarea
                value={activeFile.content}
                onChange={(e) => onFileChange(activeFile.path, e.target.value)}
                spellCheck={false}
                className="w-full h-full p-2.5 bg-transparent text-gray-200 font-mono text-[12px] leading-6 resize-none focus:outline-none selection:bg-blue-500/30 overflow-auto"
                style={{
                  tabSize: 2,
                  whiteSpace: 'pre',
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-xs font-mono">
            Ningún archivo seleccionado
          </div>
        )}
      </div>
    </div>
  );
};
