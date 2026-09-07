import React, { useState } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Code2,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  Key,
  ExternalLink,
  Table
} from 'lucide-react';
import { SupabaseConfig, VirtualFile } from '../types';

interface SupabaseHubProps {
  supabaseConfig: SupabaseConfig;
  setSupabaseConfig: React.Dispatch<React.SetStateAction<SupabaseConfig>>;
  onInjectSupabaseFiles: (files: VirtualFile[]) => void;
}

const SAMPLE_SQL_SCHEMA = `-- 1. Enable Row Level Security and Create Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  website TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create Security Policies (RLS)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 3. Automatic Profile Creation on Sign Up Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. User Workspace Projects Table
CREATE TABLE public.user_projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.user_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and edit their own projects."
  ON public.user_projects FOR ALL USING (auth.uid() = user_id);
`;

export const SupabaseHub: React.FC<SupabaseHubProps> = ({
  supabaseConfig,
  setSupabaseConfig,
  onInjectSupabaseFiles,
}) => {
  const [urlInput, setUrlInput] = useState(supabaseConfig.url || '');
  const [keyInput, setKeyInput] = useState(supabaseConfig.anonKey || '');
  const [isValidating, setIsValidating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [injectedSuccess, setInjectedSuccess] = useState(false);

  const handleValidateConnection = async () => {
    if (!urlInput.trim() || !keyInput.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in both Supabase Project URL and Anon Key.' });
      return;
    }

    setIsValidating(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/supabase/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: urlInput.trim(),
          anonKey: keyInput.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.valid) {
        setSupabaseConfig({
          url: urlInput.trim(),
          anonKey: keyInput.trim(),
          isConnected: true,
        });
        setStatusMessage({ type: 'success', text: 'Successfully authenticated with your Supabase project API!' });
      } else {
        throw new Error(data.error || 'Connection failed');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message });
      setSupabaseConfig((prev) => ({ ...prev, isConnected: false }));
    } finally {
      setIsValidating(false);
    }
  };

  const handleInjectFiles = () => {
    const targetUrl = urlInput.trim() || 'https://xyzcompany.supabase.co';
    const targetKey = keyInput.trim() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

    const clientFile: VirtualFile = {
      path: 'src/lib/supabaseClient.ts',
      language: 'typescript',
      isNew: true,
      content: `import { createClient } from '@supabase/supabase-js';

const supabaseUrl = '${targetUrl}';
const supabaseAnonKey = '${targetKey}';

/**
 * Universal Supabase Client for Authentication, Database Queries,
 * Realtime Subscriptions, and Storage.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error fetching Supabase user:', error);
    return null;
  }
  return user;
}

export async function fetchUserProjects() {
  const { data, error } = await supabase
    .from('user_projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error querying Supabase table:', error);
    return [];
  }
  return data;
}
`,
    };

    const envFile: VirtualFile = {
      path: '.env.example',
      language: 'text',
      isNew: true,
      content: `VITE_SUPABASE_URL="${targetUrl}"
VITE_SUPABASE_ANON_KEY="${targetKey}"
`,
    };

    onInjectSupabaseFiles([clientFile, envFile]);
    setInjectedSuccess(true);
    setTimeout(() => setInjectedSuccess(false), 3000);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SAMPLE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-[#0F1115] text-[#E2E8F0] overflow-y-auto p-3 sm:p-4 select-none font-sans text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2D3139]">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold text-white tracking-tight uppercase font-mono">
              Supabase Backend Integration
            </h2>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 font-mono">
            Link PostgreSQL database, Auth, and Storage directly into generated application files.
          </p>
        </div>

        {supabaseConfig.isConnected && (
          <div className="flex items-center gap-2 bg-[#16191E] border border-emerald-500/30 px-2.5 py-1 rounded text-emerald-400 text-xs font-mono">
            <span className="status-dot status-online" />
            <span>CONNECTED</span>
          </div>
        )}
      </div>

      {/* Status banner */}
      {statusMessage && (
        <div
          className={`my-2.5 p-2 rounded flex items-start gap-2 text-xs border font-mono ${
            statusMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-900/60 text-rose-300'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-400 mt-0.5" />
          )}
          <div className="flex-1 text-[11px]">{statusMessage.text}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
        {/* Left Column: Connection & Injection */}
        <div className="space-y-3">
          <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5 space-y-3 shadow-sm">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              PROJECT CREDENTIALS
            </h3>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">
                SUPABASE PROJECT URL
              </label>
              <input
                type="text"
                placeholder="https://xyzprojectid.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 mb-1">
                SUPABASE ANON / PUBLIC API KEY
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                className="w-full bg-[#0F1115] border border-[#2D3139] rounded px-2.5 py-1 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleValidateConnection}
                disabled={isValidating || !urlInput || !keyInput}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-[#1E2227] hover:bg-[#252a32] border border-[#2D3139] text-white font-medium text-xs disabled:opacity-50 transition-all font-mono"
              >
                {isValidating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Pinging API...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Test &amp; Save</span>
                  </>
                )}
              </button>

              <button
                onClick={handleInjectFiles}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition-colors"
              >
                {injectedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Injected!</span>
                  </>
                ) : (
                  <>
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Inject Client</span>
                  </>
                )}
              </button>
            </div>

            <div className="pt-2 border-t border-[#2D3139] text-[10px] text-gray-500 flex items-center justify-between font-mono">
              <span>Find keys in Supabase: Settings &gt; API</span>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:underline inline-flex items-center gap-1"
              >
                <span>Dashboard</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3 space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-400 font-mono">
              HOW SUPABASE INJECTION WORKS:
            </h4>
            <ul className="text-[11px] text-gray-400 space-y-1 list-disc list-inside">
              <li>
                Creates <code className="font-mono text-emerald-400 bg-[#0F1115] px-1 py-0.5 rounded">src/lib/supabaseClient.ts</code> with the initialized client.
              </li>
              <li>
                Feeds your schema into the AI Prompt Engine so that subsequent prompts automatically generate typed tables and user queries.
              </li>
              <li>
                Ensures code is 100% production-ready for export and zero-setup deployment on Vercel.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: SQL Schema Migrations */}
        <div className="bg-[#16191E] border border-[#2D3139] rounded-lg p-3.5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-2 border-b border-[#2D3139]">
            <div className="flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-white uppercase tracking-wider font-mono">
                SQL Schema &amp; RLS Policies
              </span>
            </div>

            <button
              onClick={handleCopySql}
              className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#1E2227] hover:bg-[#252a32] text-[10px] font-mono text-gray-300 transition-all border border-[#2D3139]"
            >
              {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
            </button>
          </div>

          <p className="text-[10px] text-gray-400 py-1.5 font-mono">
            Execute in your Supabase SQL Editor to provision user profiles, row-level security, and project tables.
          </p>

          <div className="flex-1 bg-[#0F1115] border border-[#2D3139] rounded p-2.5 overflow-auto max-h-72 font-mono text-[11px] text-emerald-400/90 leading-relaxed selection:bg-blue-500/30">
            <pre className="whitespace-pre">{SAMPLE_SQL_SCHEMA}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
