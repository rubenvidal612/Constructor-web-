import React from 'react';

interface AgentIconProps {
  className?: string;
  size?: number;
  color?: string;
  showBg?: boolean;
}

/**
 * Official OpenAI Logo (Crisp, authentic vortex geometry)
 */
export const OpenAIIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size, color, showBg = false }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={color || 'currentColor'}
    className={`shrink-0 ${className}`}
    aria-label="OpenAI"
  >
    {showBg && <rect width="24" height="24" rx="5" fill="#10A37F" fillOpacity="0.15" />}
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.6668zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
  </svg>
);

/**
 * Official Anthropic Claude Logo (Authentic Terracotta Starburst / Spark)
 */
export const ClaudeIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size, showBg = false }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Anthropic Claude"
  >
    {showBg && <rect width="24" height="24" rx="5" fill="#D97757" fillOpacity="0.15" />}
    {/* Authentic Anthropic Claude Terracotta Spark / Starburst */}
    <path
      d="M12 1.5C12.5 1.5 12.8 1.8 13 2.3L14.3 6.2C14.6 7.1 15.3 7.8 16.2 8.1L20.1 9.4C20.6 9.6 20.9 9.9 20.9 10.4C20.9 10.9 20.6 11.2 20.1 11.4L16.2 12.7C15.3 13 14.6 13.7 14.3 14.6L13 18.5C12.8 19 12.5 19.3 12 19.3C11.5 19.3 11.2 19 11 18.5L9.7 14.6C9.4 13.7 8.7 13 7.8 12.7L3.9 11.4C3.4 11.2 3.1 10.9 3.1 10.4C3.1 9.9 3.4 9.6 3.9 9.4L7.8 8.1C8.7 7.8 9.4 7.1 9.7 6.2L11 2.3C11.2 1.8 11.5 1.5 12 1.5Z"
      fill="#D97757"
    />
    <circle cx="12" cy="10.4" r="2.2" fill="#FFFFFF" />
    <circle cx="12" cy="10.4" r="1.1" fill="#D97757" />
    {/* Secondary warm ambient spark */}
    <path
      d="M18.8 16.2C19.1 16.2 19.3 16.4 19.4 16.7L19.9 18.1C20.1 18.6 20.4 18.9 20.9 19.1L22.3 19.6C22.6 19.7 22.8 19.9 22.8 20.2C22.8 20.5 22.6 20.7 22.3 20.8L20.9 21.3C20.4 21.5 20.1 21.8 19.9 22.3L19.4 23.7C19.3 24 19.1 24.2 18.8 24.2C18.5 24.2 18.3 24 18.2 23.7L17.7 22.3C17.5 21.8 17.2 21.5 16.7 21.3L15.3 20.8C15 20.7 14.8 20.5 14.8 20.2C14.8 19.9 15 19.7 15.3 19.6L16.7 19.1C17.2 18.9 17.5 18.6 17.7 18.1L18.2 16.7C18.3 16.4 18.5 16.2 18.8 16.2Z"
      fill="#CC785C"
    />
  </svg>
);

/**
 * Official DeepSeek Logo (Authentic Blue Whale with spout and wave)
 */
export const DeepSeekIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size, showBg = false }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="DeepSeek"
  >
    {showBg && <rect width="24" height="24" rx="5" fill="#0E78F9" fillOpacity="0.15" />}
    {/* DeepSeek leaping blue whale body */}
    <path
      d="M3.5 13.8C3.8 11.4 5.5 9.2 8.2 8.2C11.5 7 15.4 7.5 18.4 9.4C20.1 10.5 21.2 12.3 21.5 14.3C21.6 15.3 21.2 16.3 20.3 17C19.2 17.8 17.6 18.1 16.2 17.8C13.8 17.4 11.5 16.2 9.5 14.9C7.2 13.5 5 14.5 3.5 13.8Z"
      fill="#0E78F9"
    />
    <path
      d="M17.5 11.8C16.5 10.6 15 9.8 13.2 9.8C11.5 9.8 10.2 10.6 9.5 11.6C10.5 11 11.8 10.7 13.2 10.7C15.2 10.7 16.8 11.6 17.5 12.8C17.6 12.4 17.6 12.1 17.5 11.8Z"
      fill="#60A5FA"
    />
    {/* Whale eye */}
    <circle cx="17.2" cy="11.4" r="1.1" fill="#FFFFFF" />
    <circle cx="17.4" cy="11.3" r="0.5" fill="#091E42" />
    {/* Blowhole water spray */}
    <path
      d="M13.2 3.8C13.8 4.8 14.5 5.4 15.5 5.4"
      stroke="#38BDF8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M11.6 4.5C12.1 5.3 12.7 5.7 13.4 5.7"
      stroke="#38BDF8"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Whale tail fluke */}
    <path
      d="M4.5 13.8C3.8 14.6 2.8 15 2 14.8C2.2 13.6 2.8 12.8 3.8 12.4C3.2 11.6 3 10.6 3.2 9.6C4 10.3 4.6 11.3 4.5 12.4"
      fill="#0E78F9"
    />
  </svg>
);

/**
 * Official Google Gemini 4-Pointed Sparkle Star Logo with authentic Google gradient
 */
export const GeminiIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size, showBg = false }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Google Gemini"
  >
    {showBg && <rect width="24" height="24" rx="5" fill="#4285F4" fillOpacity="0.15" />}
    <defs>
      <linearGradient id="gemini-official-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1BA1E3" />
        <stop offset="35%" stopColor="#5468FF" />
        <stop offset="70%" stopColor="#9B72CF" />
        <stop offset="100%" stopColor="#D96570" />
      </linearGradient>
    </defs>
    <path
      d="M12 2C12 7.523 16.477 12 22 12C16.477 12 12 16.477 12 22C12 16.477 7.523 12 2 12C7.523 12 12 7.523 12 2Z"
      fill="url(#gemini-official-grad)"
    />
  </svg>
);

/**
 * Official Alibaba Qwen Logo (Purple Polyhedron Crystal)
 */
export const QwenIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Alibaba Qwen"
  >
    <rect width="24" height="24" rx="5" fill="#615CED" fillOpacity="0.15" />
    {/* Faceted isometric cube/hexagon */}
    <path
      d="M12 3.5L19 7.5V16.5L12 20.5L5 16.5V7.5L12 3.5Z"
      fill="#615CED"
    />
    <path
      d="M12 3.5L19 7.5L12 12L5 7.5L12 3.5Z"
      fill="#8B85FF"
      fillOpacity="0.9"
    />
    <path
      d="M12 12L19 7.5V16.5L12 20.5V12Z"
      fill="#4F46E5"
    />
    <path
      d="M5 7.5L12 12V20.5L5 16.5V7.5Z"
      fill="#6366F1"
      fillOpacity="0.75"
    />
  </svg>
);

/**
 * Official GLM / Zhipu AI Logo (Cyan / Blue Connected Matrix Cube)
 */
export const GLMIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="GLM Zhipu AI"
  >
    <rect width="24" height="24" rx="5" fill="#00D2FF" fillOpacity="0.15" />
    <circle cx="8" cy="8" r="2.5" fill="#00D2FF" />
    <circle cx="16" cy="8" r="2.5" fill="#0A84FF" />
    <circle cx="8" cy="16" r="2.5" fill="#0A84FF" />
    <circle cx="16" cy="16" r="2.5" fill="#00D2FF" />
    <path d="M8 8L16 16M16 8L8 16" stroke="#00D2FF" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="2" fill="#FFFFFF" />
  </svg>
);

/**
 * Official Moonshot Kimi Logo (Infinity ring with violet brand identity)
 */
export const KimiIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Moonshot Kimi"
  >
    <rect width="24" height="24" rx="5" fill="#8B5CF6" fillOpacity="0.15" />
    <path
      d="M7.5 7.5C9.5 7.5 11 9 12 11C13 9 14.5 7.5 16.5 7.5C19 7.5 20.5 9.5 20.5 12C20.5 14.5 19 16.5 16.5 16.5C14.5 16.5 13 15 12 13C11 15 9.5 16.5 7.5 16.5C5 16.5 3.5 14.5 3.5 12C3.5 9.5 5 7.5 7.5 7.5Z"
      stroke="#A78BFA"
      strokeWidth="2.2"
    />
    <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
  </svg>
);

/**
 * Official MiniMax Logo (Vibrant Orange-Red Waveform / M mark)
 */
export const MiniMaxIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="MiniMax"
  >
    <rect width="24" height="24" rx="5" fill="#F85D38" fillOpacity="0.15" />
    <path
      d="M5 16V8L9 14L12 10L15 14L19 8V16"
      stroke="#F85D38"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Official Xiaomi MiMo Logo (Orange Squircle with authentic MI typography)
 */
export const XiaomiIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Xiaomi MiMo"
  >
    <rect width="24" height="24" rx="6" fill="#FF6900" />
    <path
      d="M7 8V16M7 10H10V16M13.5 8V16M13.5 11H16V16"
      stroke="#FFFFFF"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Official Tencent Hunyuan Logo (Blue-Violet Cloud & Wave crest)
 */
export const TencentIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Tencent Hunyuan"
  >
    <rect width="24" height="24" rx="5" fill="#0052D9" fillOpacity="0.15" />
    <path
      d="M6 14.5C6 11.8 8.1 9.7 10.7 9.5C11.5 7.4 13.5 6 15.9 6C18.9 6 21.3 8.3 21.5 11.3C21.8 11.5 22 11.8 22 12.2C22 13 21.3 13.7 20.5 13.7H6.5C6.2 13.7 6 14 6 14.5Z"
      fill="#0052D9"
    />
    <path
      d="M4 17.5C7 16 11 16 14 17.5C17 19 20 18 22 17"
      stroke="#38BDF8"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * OpenClaw Agent Runner Icon (Cybernetic Autonomous Agent Claw)
 */
export const OpenClawIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="OpenClaw Agent"
  >
    <rect width="24" height="24" rx="5" fill="#10B981" fillOpacity="0.15" />
    <path
      d="M12 4V8M8 6L10 9M16 6L14 9"
      stroke="#10B981"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M7 11C7 8.2 9.2 6 12 6C14.8 6 17 8.2 17 11V15C17 17.8 14.8 20 12 20C9.2 20 7 17.8 7 15V11Z"
      stroke="#34D399"
      strokeWidth="1.8"
    />
    <circle cx="12" cy="13" r="2" fill="#10B981" />
  </svg>
);

/**
 * Code CLI Agent Icon (Terminal Prompt & Code Bracket)
 */
export const CodeAgentIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Code CLI Agent"
  >
    <rect width="24" height="24" rx="5" fill="#F59E0B" fillOpacity="0.15" />
    <path
      d="M6 8L10 12L6 16"
      stroke="#F59E0B"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 16H18"
      stroke="#FCD34D"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Modo Auto Icon (Dynamic Multi-Model Neural Nexus with gradient spark)
 */
export const AutoAgentIcon: React.FC<AgentIconProps> = ({ className = 'w-4 h-4', size }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    className={`shrink-0 ${className}`}
    aria-label="Modo Auto"
  >
    <defs>
      <linearGradient id="auto-nexus-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#EC4899" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#auto-nexus-grad)" strokeWidth="1.8" strokeDasharray="3 2" />
    <path
      d="M12 4L13.8 9.5L19.5 12L13.8 14.5L12 20L10.2 14.5L4.5 12L10.2 9.5L12 4Z"
      fill="url(#auto-nexus-grad)"
    />
  </svg>
);

/**
 * Universal Agent Logo Resolver Component
 * Returns the exact brand SVG for any model ID, provider, or category
 */
interface AgentLogoProps {
  modelId?: string;
  category?: string;
  provider?: string;
  className?: string;
  size?: number;
}

export const AgentLogo: React.FC<AgentLogoProps> = ({
  modelId = '',
  category = '',
  provider = '',
  className = 'w-4 h-4',
  size,
}) => {
  const normalizedId = modelId.toLowerCase();
  const normalizedCat = category.toLowerCase();
  const normalizedProv = provider.toLowerCase();

  // 1. Auto / Routing
  if (normalizedId === 'auto' || normalizedCat === 'routing') {
    return <AutoAgentIcon className={className} size={size} />;
  }

  // 2. OpenAI Family
  if (
    normalizedCat === 'openai' ||
    normalizedProv === 'openai' ||
    normalizedId.startsWith('gpt-') ||
    normalizedId === 'o1' ||
    normalizedId === 'o3-mini' ||
    normalizedId.includes('openai')
  ) {
    return <OpenAIIcon className={`text-emerald-400 ${className}`} size={size} />;
  }

  // 3. Anthropic Claude Family
  if (
    normalizedCat === 'claude' ||
    normalizedProv === 'anthropic' ||
    normalizedId.includes('claude')
  ) {
    return <ClaudeIcon className={className} size={size} />;
  }

  // 4. DeepSeek Family
  if (
    normalizedCat === 'deepseek' ||
    normalizedProv === 'deepseek' ||
    normalizedId.includes('deepseek')
  ) {
    return <DeepSeekIcon className={className} size={size} />;
  }

  // 5. Google Gemini Family
  if (
    normalizedCat === 'google' ||
    normalizedProv === 'gemini' ||
    normalizedId.includes('gemini')
  ) {
    return <GeminiIcon className={className} size={size} />;
  }

  // 6. Alibaba Qwen Family
  if (
    normalizedCat === 'qwen' ||
    normalizedId.includes('qwen')
  ) {
    return <QwenIcon className={className} size={size} />;
  }

  // 7. GLM / Zhipu AI
  if (
    normalizedCat === 'glm' ||
    normalizedId.includes('glm')
  ) {
    return <GLMIcon className={className} size={size} />;
  }

  // 8. Moonshot Kimi
  if (normalizedId.includes('kimi')) {
    return <KimiIcon className={className} size={size} />;
  }

  // 9. MiniMax
  if (normalizedId.includes('minimax')) {
    return <MiniMaxIcon className={className} size={size} />;
  }

  // 10. Xiaomi
  if (normalizedId.includes('mimo') || normalizedId.includes('xiaomi')) {
    return <XiaomiIcon className={className} size={size} />;
  }

  // 11. Tencent
  if (normalizedId.includes('tencent') || normalizedId.includes('hy3') || normalizedId.includes('hunyuan')) {
    return <TencentIcon className={className} size={size} />;
  }

  // 12. OpenClaw Agent
  if (normalizedId.includes('openclaw')) {
    return <OpenClawIcon className={className} size={size} />;
  }

  // 13. Code CLI Agent
  if (normalizedId.includes('code-agent') || normalizedId.includes('cli')) {
    return <CodeAgentIcon className={className} size={size} />;
  }

  // Default fallback for any others
  return <AutoAgentIcon className={className} size={size} />;
};
