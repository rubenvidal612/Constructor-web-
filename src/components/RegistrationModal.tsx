import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Shield, ArrowRight, Lock, Mail, User, Zap, Crown } from 'lucide-react';
import { AppUser } from '../types';
import { ClaudeIcon, DeepSeekIcon, OpenAIIcon, GeminiIcon } from './AgentIcons';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AppUser) => void;
  initialPlan?: 'free' | 'pro' | 'team';
}

export function RegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  initialPlan = 'free',
}: RegistrationModalProps) {
  const [mode, setMode] = useState<'register' | 'login'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'pro' | 'team'>(initialPlan);
  const [modelPreference, setModelPreference] = useState('Claude 3.7 Sonnet & DeepSeek V3');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const existingUsersRaw = localStorage.getItem('ais_registered_users');
      const existingUsers: AppUser[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      if (mode === 'register') {
        const newUser: AppUser = {
          id: 'usr-' + Date.now(),
          name: name.trim() || email.split('@')[0],
          email: email.trim().toLowerCase(),
          registeredAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
          plan: selectedPlan,
          modelPreference,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        };

        const updated = [newUser, ...existingUsers.filter(u => u.email !== newUser.email)];
        localStorage.setItem('ais_registered_users', JSON.stringify(updated));
        localStorage.setItem('ais_current_user', JSON.stringify(newUser));
        onSuccess(newUser);
        onClose();
      } else {
        // Login mode
        const found = existingUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
        const loggedUser: AppUser = found || {
          id: 'usr-' + Date.now(),
          name: email.split('@')[0],
          email: email.trim().toLowerCase(),
          registeredAt: 'Hoy',
          plan: 'free',
          modelPreference,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        };

        localStorage.setItem('ais_current_user', JSON.stringify(loggedUser));
        onSuccess(loggedUser);
        onClose();
      }
    }, 600);
  };

  const handleDemoSignIn = () => {
    const demoUser: AppUser = {
      id: 'usr-demo',
      name: 'Desarrollador Pro',
      email: 'dev.pro@devnova.ai',
      registeredAt: 'Hoy',
      plan: 'pro',
      modelPreference: 'Claude 3.7 + DeepSeek V3',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=DevNovaPro',
    };
    localStorage.setItem('ais_current_user', JSON.stringify(demoUser));
    onSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#12151B] border border-[#2D3340] rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Glow Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-[#242933] bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-purple-950/30">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-blue-400 uppercase">
              Web AI Studio
            </span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'register' ? 'Crea tu Cuenta de Desarrollador' : 'Iniciar Sesión en el Studio'}
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {mode === 'register'
              ? 'Únete a miles de creadores y comienza a construir aplicaciones completas con IA hoy mismo.'
              : 'Bienvenido de vuelta. Ingresa para acceder a tus proyectos y agentes.'}
          </p>

          {/* Mode Switcher */}
          <div className="flex items-center bg-[#0D1015] p-1 rounded-xl border border-[#232834] mt-4 max-w-xs">
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Registrarse
            </button>
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej. Carlos Hernández"
                  className="w-full bg-[#0D1015] border border-[#2D3340] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full bg-[#0D1015] border border-[#2D3340] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-[#0D1015] border border-[#2D3340] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-white pl-10 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              {/* Plan Picker */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Plan Inicial
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('free')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPlan === 'free'
                        ? 'bg-blue-950/40 border-blue-500 text-white shadow-sm'
                        : 'bg-[#0D1015] border-[#242933] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Gratis</span>
                      <Zap className="w-3 h-3 text-blue-400" />
                    </div>
                    <div className="text-[11px] text-gray-400">$0 / siempre</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('pro')}
                    className={`p-2.5 rounded-xl border text-left transition-all relative ${
                      selectedPlan === 'pro'
                        ? 'bg-indigo-950/50 border-indigo-500 text-white shadow-sm'
                        : 'bg-[#0D1015] border-[#242933] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Pro</span>
                      <Crown className="w-3 h-3 text-amber-400" />
                    </div>
                    <div className="text-[11px] text-gray-400">$19 / mes</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('team')}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedPlan === 'team'
                        ? 'bg-purple-950/40 border-purple-500 text-white shadow-sm'
                        : 'bg-[#0D1015] border-[#242933] text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold mb-1">
                      <span>Team</span>
                      <Shield className="w-3 h-3 text-purple-400" />
                    </div>
                    <div className="text-[11px] text-gray-400">$49 / mes</div>
                  </button>
                </div>
              </div>

              {/* Model Preference */}
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1.5">
                  Agente / Modelo Preferido al Iniciar
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setModelPreference('Claude 3.7 Sonnet & DeepSeek V3')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      modelPreference.includes('Claude')
                        ? 'border-amber-500/60 bg-amber-500/10 text-white shadow-sm shadow-amber-500/10'
                        : 'border-[#242D3E] bg-[#0E121A] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center -space-x-1 shrink-0">
                      <ClaudeIcon className="w-4 h-4" />
                      <DeepSeekIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-white">Dual Agent</div>
                      <div className="text-[10px] text-gray-400 truncate">Claude + DeepSeek</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModelPreference('DeepSeek V3 (Alta Velocidad)')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      modelPreference.includes('DeepSeek V3 (Alta')
                        ? 'border-blue-500/60 bg-blue-500/10 text-white shadow-sm shadow-blue-500/10'
                        : 'border-[#242D3E] bg-[#0E121A] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <DeepSeekIcon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-white">DeepSeek V3</div>
                      <div className="text-[10px] text-gray-400 truncate">Ultra Rápido</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModelPreference('OpenAI GPT-4o')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      modelPreference === 'OpenAI GPT-4o'
                        ? 'border-emerald-500/60 bg-emerald-500/10 text-white shadow-sm shadow-emerald-500/10'
                        : 'border-[#242D3E] bg-[#0E121A] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <OpenAIIcon className="w-4 h-4 shrink-0" color="#10A37F" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-white">OpenAI GPT-4o</div>
                      <div className="text-[10px] text-gray-400 truncate">Multimodal UI</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModelPreference('Google Gemini 2.5 Flash')}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      modelPreference === 'Google Gemini 2.5 Flash'
                        ? 'border-purple-500/60 bg-purple-500/10 text-white shadow-sm shadow-purple-500/10'
                        : 'border-[#242D3E] bg-[#0E121A] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <GeminiIcon className="w-4 h-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate text-white">Gemini 2.5</div>
                      <div className="text-[10px] text-gray-400 truncate">Gran Contexto</div>
                    </div>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 text-xs">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Configurando entorno...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'register' ? 'Crear Cuenta y Entrar al Studio' : 'Entrar al Studio'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          {/* Demo Button */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="text-xs text-blue-400 hover:text-blue-300 underline font-medium transition-colors"
            >
              ¿Solo quieres probar? Entrar en Modo Demo Instantáneo
            </button>
          </div>

          {/* Guarantee Badges */}
          <div className="pt-3 border-t border-[#232834] flex items-center justify-between text-[11px] text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sin tarjeta requerida</span>
            </span>
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Código 100% exportable</span>
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Despliegues ilimitados</span>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
