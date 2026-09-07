import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  Sparkles,
  BarChart3,
  ShoppingBag,
  FileCode2,
  FolderKanban,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowRight,
  Clock,
  Layers,
  Code2
} from 'lucide-react';
import { STARTER_TEMPLATES } from '../data/templates';
import { ProjectTemplate, SavedProject, VirtualFile } from '../types';

interface ProjectPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectId: string;
  currentProjectName: string;
  savedProjects: SavedProject[];
  onSelectProject: (project: SavedProject) => void;
  onSelectTemplate: (template: ProjectTemplate) => void;
  onCreateNewProject: (name?: string) => void;
  onDeleteProject: (projectId: string) => void;
  onDuplicateProject: (projectId: string) => void;
}

export const ProjectPaletteModal: React.FC<ProjectPaletteModalProps> = ({
  isOpen,
  onClose,
  currentProjectId,
  currentProjectName,
  savedProjects,
  onSelectProject,
  onSelectTemplate,
  onCreateNewProject,
  onDeleteProject,
  onDuplicateProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'templates' | 'projects'>('templates');
  const [newProjectName, setNewProjectName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<ProjectTemplate | null>(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    if (!searchQuery.trim()) return STARTER_TEMPLATES;
    const q = searchQuery.toLowerCase();
    return STARTER_TEMPLATES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Filter saved projects
  const filteredProjects = useMemo(() => {
    if (!searchQuery.trim()) return savedProjects;
    const q = searchQuery.toLowerCase();
    return savedProjects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [savedProjects, searchQuery]);

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateNewProject(newProjectName.trim() || undefined);
    setNewProjectName('');
    setShowCreateForm(false);
    onClose();
  };

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-blue-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-5 h-5 text-indigo-400" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileCode2 className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div
      id="project-palette-backdrop"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-10 sm:pt-20 p-3 sm:p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="project-palette-container"
        className="bg-[#12151D] border border-[#2B303C] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search & Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-[#252A35] bg-[#0E1015] flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Layers className="w-4 h-4" />
          </div>

          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar plantilla o proyecto guardado (ej: landing, saas, e-commerce)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full bg-[#181C25] border border-[#2B303C] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors font-sans"
            />
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#1C202B] transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher & Action Button */}
        <div className="px-4 py-2 border-b border-[#252A35] bg-[#141720] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 bg-[#0E1016] p-1 rounded-xl border border-[#252A35]">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'templates'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plantillas de Arranque ({STARTER_TEMPLATES.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Mis Proyectos ({savedProjects.length})</span>
            </button>
          </div>

          {!showCreateForm ? (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1C202B] hover:bg-[#252A37] border border-[#2B303C] text-xs font-semibold text-blue-400 hover:text-blue-300 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Nuevo Proyecto</span>
            </button>
          ) : null}
        </div>

        {/* Quick New Project Inline Form */}
        {showCreateForm && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-3 bg-[#171B26] border-b border-[#252A35] flex items-center gap-2 animate-in slide-in-from-top-2 duration-150"
          >
            <input
              type="text"
              placeholder="Nombre del nuevo proyecto (ej: mi-tienda-online)"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
              className="flex-1 bg-[#0E1016] border border-[#2B303C] rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-sm"
            >
              Crear
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="px-2.5 py-1.5 bg-[#1C202B] hover:bg-[#252A37] text-gray-300 text-xs rounded-lg"
            >
              Cancelar
            </button>
          </form>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {activeTab === 'templates' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">
                  Selecciona una plantilla para comenzar al instante:
                </span>
                <span className="text-[11px] text-blue-400 font-mono">
                  100% Funcionales con código interactivo
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredTemplates.map((template) => {
                  const isLanding = template.id === 'interactive-landing';
                  return (
                    <div
                      key={template.id}
                      onClick={() => {
                        onSelectTemplate(template);
                        onClose();
                      }}
                      className={`group p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                        isLanding
                          ? 'bg-gradient-to-br from-blue-950/40 via-[#131722] to-[#12151D] border-blue-500/40 hover:border-blue-400 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20'
                          : 'bg-[#151922] border-[#252A35] hover:border-[#3A4254] hover:bg-[#1A1F2C]'
                      }`}
                    >
                      {/* Top Header */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-[#1D2230] border border-[#2E3545]">
                              {getTemplateIcon(template.iconName)}
                            </div>
                            <div>
                              <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                                <span>{template.name}</span>
                              </h3>
                              <span className="text-[10px] font-mono text-gray-500">
                                {template.category}
                              </span>
                            </div>
                          </div>

                          {template.badge && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isLanding
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/40 animate-pulse'
                                  : 'bg-[#1E2330] text-gray-300 border-[#2E3545]'
                              }`}
                            >
                              {template.badge}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-gray-400 leading-relaxed mb-4">
                          {template.description}
                        </p>
                      </div>

                      {/* Bottom Footer & Action */}
                      <div className="pt-3 border-t border-[#252A35] flex items-center justify-between text-xs">
                        <span className="text-[11px] font-mono text-gray-500">
                          {template.files.length} archivos incluidos
                        </span>

                        <div className="flex items-center gap-1 font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
                          <span>Usar Plantilla</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* SAVED PROJECTS LIST */
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-medium text-gray-400 uppercase tracking-wider">
                  Proyectos guardados en tu navegador:
                </span>
                <span className="text-[11px] text-gray-500 font-mono">
                  Se guardan automáticamente en tiempo real
                </span>
              </div>

              {filteredProjects.length === 0 ? (
                <div className="text-center py-12 text-gray-500 text-xs">
                  No se encontraron proyectos. ¡Crea uno nuevo o elige una plantilla!
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProjects.map((proj) => {
                    const isCurrent = proj.id === currentProjectId;
                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                          isCurrent
                            ? 'bg-blue-950/25 border-blue-500/50 shadow-sm'
                            : 'bg-[#151922] border-[#252A35] hover:border-[#353D4E]'
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                          onClick={() => {
                            onSelectProject(proj);
                            onClose();
                          }}
                        >
                          <div className="w-8 h-8 rounded-lg bg-[#1E2330] border border-[#2E3545] flex items-center justify-center text-blue-400 shrink-0 font-bold text-xs font-mono">
                            {proj.name.substring(0, 2).toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-semibold text-white truncate hover:text-blue-400 transition-colors">
                                {proj.name}
                              </h4>
                              {isCurrent && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                                  Activo
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-gray-500 font-mono mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {proj.updatedAt}
                              </span>
                              <span>•</span>
                              <span>{proj.files.length} archivos</span>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons (Duplicate, Delete, Switch) */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => onDuplicateProject(proj.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E2330] transition-colors"
                            title="Duplicar proyecto"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {savedProjects.length > 1 && (
                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `¿Estás seguro de eliminar permanentemente "${proj.name}"?`
                                  )
                                ) {
                                  onDeleteProject(proj.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-[#1E2330] transition-colors"
                              title="Eliminar proyecto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!isCurrent && (
                            <button
                              onClick={() => {
                                onSelectProject(proj);
                                onClose();
                              }}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
                            >
                              Abrir
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-3 border-t border-[#252A35] bg-[#0E1015] flex items-center justify-between text-xs text-gray-500 font-mono shrink-0">
          <div className="flex items-center gap-3">
            <span>
              Atajo: <kbd className="px-1.5 py-0.5 rounded bg-[#1C202B] border border-[#2E3545] text-gray-300">⌘K</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-[#1C202B] border border-[#2E3545] text-gray-300">Ctrl+K</kbd>
            </span>
            <span>•</span>
            <span>
              Cerrar: <kbd className="px-1.5 py-0.5 rounded bg-[#1C202B] border border-[#2E3545] text-gray-300">Esc</kbd>
            </span>
          </div>

          <div className="text-[11px] text-gray-400">
            Proyecto actual: <strong className="text-white">{currentProjectName}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
