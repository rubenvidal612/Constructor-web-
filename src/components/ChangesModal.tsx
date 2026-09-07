import React, { useState, useMemo } from 'react';
import {
  X,
  FileCode,
  Check,
  Copy,
  RotateCcw,
  GitCompare,
  Code2,
  CheckCircle2,
  Plus,
  Minus
} from 'lucide-react';
import { VirtualFile } from '../types';

interface ChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  filesModified: string[];
  allFiles: VirtualFile[];
  previousFiles?: VirtualFile[];
  checkpointFiles?: VirtualFile[];
  onSelectFile?: (path: string) => void;
  onRestoreCheckpoint?: (files: VirtualFile[]) => void;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  oldLine?: number;
  newLine?: number;
}

// Compute simple Longest Common Subsequence line diff
function computeLineDiff(oldText: string, newText: string): DiffLine[] {
  const oldLines = oldText ? oldText.split('\n') : [];
  const newLines = newText ? newText.split('\n') : [];

  const m = oldLines.length;
  const n = newLines.length;

  if (m === 0) {
    return newLines.map((content, idx) => ({
      type: 'added',
      content,
      newLine: idx + 1,
    }));
  }

  if (n === 0) {
    return oldLines.map((content, idx) => ({
      type: 'removed',
      content,
      oldLine: idx + 1,
    }));
  }

  // DP table for LCS
  // Cap at 1000 lines for instant performance
  const maxLines = 1200;
  const safeOld = oldLines.slice(0, maxLines);
  const safeNew = newLines.slice(0, maxLines);
  const sl1 = safeOld.length;
  const sl2 = safeNew.length;

  const dp: number[][] = Array.from({ length: sl1 + 1 }, () => new Array(sl2 + 1).fill(0));

  for (let i = 1; i <= sl1; i++) {
    for (let j = 1; j <= sl2; j++) {
      if (safeOld[i - 1] === safeNew[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to create diff
  const result: DiffLine[] = [];
  let i = sl1;
  let j = sl2;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && safeOld[i - 1] === safeNew[j - 1]) {
      result.unshift({
        type: 'unchanged',
        content: safeOld[i - 1],
        oldLine: i,
        newLine: j,
      });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({
        type: 'added',
        content: safeNew[j - 1],
        newLine: j,
      });
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      result.unshift({
        type: 'removed',
        content: safeOld[i - 1],
        oldLine: i,
      });
      i--;
    }
  }

  return result;
}

export const ChangesModal: React.FC<ChangesModalProps> = ({
  isOpen,
  onClose,
  filesModified,
  allFiles,
  previousFiles,
  checkpointFiles,
  onSelectFile,
  onRestoreCheckpoint,
}) => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    filesModified[0] || (allFiles[0]?.path ?? '')
  );
  const [viewMode, setViewMode] = useState<'diff' | 'full'>('diff');
  const [copied, setCopied] = useState(false);
  const [restored, setRestored] = useState(false);

  // File versions
  const targetCurrent =
    checkpointFiles?.find((f) => f.path === selectedFilePath) ||
    allFiles.find((f) => f.path === selectedFilePath);

  const targetPrev = previousFiles?.find((f) => f.path === selectedFilePath);

  const oldContent = targetPrev ? targetPrev.content : '';
  const newContent = targetCurrent ? targetCurrent.content : '';

  // Calculate diff
  const diffLines = useMemo(() => {
    return computeLineDiff(oldContent, newContent);
  }, [oldContent, newContent]);

  const stats = useMemo(() => {
    const added = diffLines.filter((l) => l.type === 'added').length;
    const removed = diffLines.filter((l) => l.type === 'removed').length;
    return { added, removed };
  }, [diffLines]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (targetCurrent) {
      navigator.clipboard.writeText(targetCurrent.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRestore = () => {
    if (checkpointFiles && onRestoreCheckpoint) {
      onRestoreCheckpoint(checkpointFiles);
      setRestored(true);
      setTimeout(() => {
        setRestored(false);
        onClose();
      }, 1200);
    }
  };

  return (
    <div
      id="changes-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        id="changes-modal-container"
        className="bg-[#14171E] border border-[#2D3139] rounded-t-2xl sm:rounded-2xl w-full max-w-4xl h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 border-b border-[#2D3139] px-4 sm:px-5 flex items-center justify-between bg-[#0E1015] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <GitCompare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">Historial de Cambios &amp; Diff</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#1E2228] text-gray-300 border border-[#2D3139] font-mono">
                  {filesModified.length} {filesModified.length === 1 ? 'archivo' : 'archivos'}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Compara exactamente qué líneas agregó o modificó la inteligencia artificial
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1E2227] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* File Tabs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-2.5 border-b border-[#2D3139] bg-[#10131A] shrink-0 gap-2">
          {/* File selector buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-0.5">
            {filesModified.map((path) => {
              const isSelected = selectedFilePath === path;
              return (
                <button
                  key={path}
                  onClick={() => setSelectedFilePath(path)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all shrink-0 ${
                    isSelected
                      ? 'bg-blue-600/20 text-blue-300 border border-blue-500/50 shadow-sm'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#1A1D24] border border-transparent'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{path}</span>
                </button>
              );
            })}
          </div>

          {/* Diff View Mode Switcher & Stats */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#161920] border border-[#2D3139] text-[11px] font-mono">
              <span className="flex items-center gap-0.5 text-emerald-400 font-semibold">
                <Plus className="w-3 h-3" />
                {stats.added}
              </span>
              <span className="text-gray-600">/</span>
              <span className="flex items-center gap-0.5 text-rose-400 font-semibold">
                <Minus className="w-3 h-3" />
                {stats.removed}
              </span>
            </div>

            <div className="flex items-center p-0.5 rounded-lg bg-[#161920] border border-[#2D3139]">
              <button
                onClick={() => setViewMode('diff')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'diff'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Visual Diff
              </button>
              <button
                onClick={() => setViewMode('full')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'full'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Código Completo
              </button>
            </div>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 overflow-auto bg-[#0B0D12] font-mono text-xs text-gray-300 p-0 relative">
          {viewMode === 'diff' ? (
            <div className="min-w-full inline-block py-2">
              {diffLines.map((line, idx) => {
                const isAdded = line.type === 'added';
                const isRemoved = line.type === 'removed';

                return (
                  <div
                    key={idx}
                    className={`flex items-stretch font-mono text-[11.5px] leading-relaxed select-text transition-colors ${
                      isAdded
                        ? 'bg-emerald-950/35 text-emerald-200 border-l-2 border-emerald-500'
                        : isRemoved
                        ? 'bg-rose-950/35 text-rose-200 border-l-2 border-rose-500'
                        : 'hover:bg-[#12151C] text-gray-300 border-l-2 border-transparent'
                    }`}
                  >
                    {/* Line numbers */}
                    <div className="w-10 px-2 py-0.5 text-right text-gray-600 select-none text-[10px] shrink-0 border-r border-[#202530]">
                      {line.oldLine || ''}
                    </div>
                    <div className="w-10 px-2 py-0.5 text-right text-gray-600 select-none text-[10px] shrink-0 border-r border-[#202530]">
                      {line.newLine || ''}
                    </div>

                    {/* Diff Marker (+, -, ' ') */}
                    <div
                      className={`w-6 text-center select-none shrink-0 font-bold ${
                        isAdded ? 'text-emerald-400' : isRemoved ? 'text-rose-400' : 'text-transparent'
                      }`}
                    >
                      {isAdded ? '+' : isRemoved ? '-' : ' '}
                    </div>

                    {/* Code Content */}
                    <div className="flex-1 px-2 py-0.5 whitespace-pre overflow-x-visible">
                      {line.content || ' '}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4">
              <pre className="whitespace-pre-wrap leading-relaxed text-[11.5px] text-gray-200">
                {newContent || 'Archivo vacío.'}
              </pre>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3 sm:px-5 border-t border-[#2D3139] bg-[#10131A] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {checkpointFiles && onRestoreCheckpoint && (
              <button
                onClick={handleRestore}
                disabled={restored}
                className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all w-full sm:w-auto shadow-sm"
              >
                {restored ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>¡Restaurado con éxito!</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Restaurar esta versión</span>
                  </>
                )}
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#222731] border border-[#2D3139] text-gray-300 hover:text-white text-xs font-medium transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copiado' : 'Copiar Archivo'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {onSelectFile && (
              <button
                onClick={() => {
                  onSelectFile(selectedFilePath);
                  onClose();
                }}
                className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all w-full sm:w-auto"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Abrir en Editor</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-[#1A1D24] hover:bg-[#222731] text-gray-300 text-xs border border-[#2D3139] transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
