export interface VirtualFile {
  path: string;
  content: string;
  language: string;
  isModified?: boolean;
  isNew?: boolean;
}

export interface ProjectMetadata {
  id: string;
  name: string;
  description: string;
  template: 'react-tailwind' | 'nextjs-saas' | 'vanilla-html';
  createdAt: string;
  updatedAt: string;
  githubRepo?: string;
  vercelUrl?: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  total_private_repos?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
  description: string | null;
  default_branch: string;
  updated_at: string;
}

export interface VercelUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface VercelDeployment {
  id: string;
  url: string;
  readyState: 'BUILDING' | 'READY' | 'ERROR' | 'CANCELED' | 'INITIALIZING';
  inspectorUrl?: string;
  createdAt: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isConnected: boolean;
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: 'image' | 'file' | 'drive';
  dataUrl?: string;
  size?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  filesModified?: string[];
  isStreaming?: boolean;
  durationSeconds?: number;
  checkpointFiles?: VirtualFile[];
  previousFiles?: VirtualFile[];
  liked?: boolean | null;
  checkpointSaved?: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export type LLMProvider = 'gemini' | 'b_ai' | 'deepseek' | 'groq' | 'custom';

export interface LLMConfig {
  provider: LLMProvider;
  customEndpoint?: string;
  customApiKey?: string;
  modelName: string;
  bAiApiKey?: string;
  bAiModel?: string;
}

export interface SecurityEncryptionResult {
  ivHex: string;
  authTagHex: string;
  ciphertextHex: string;
  algorithm: string;
  decryptedVerification?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'Landing' | 'SaaS' | 'E-Commerce' | 'Kanban' | 'Blank';
  badge?: string;
  iconName: string;
  files: VirtualFile[];
}

export interface SavedProject {
  id: string;
  name: string;
  description?: string;
  updatedAt: string;
  files: VirtualFile[];
  messages?: ChatMessage[];
  templateId?: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  registeredAt: string;
  plan: 'free' | 'pro' | 'team';
  avatar?: string;
  modelPreference?: string;
}

