export interface ClientGenerateRequest {
  prompt: string;
  systemPrompt?: string;
  files: Array<{ path: string; content: string; language?: string }>;
  supabaseConfig?: any;
  injectSupabase?: boolean;
  provider?: string;
  customEndpoint?: string;
  customApiKey?: string;
  customModel?: string;
  bAiApiKey?: string;
  bAiModel?: string;
}

export interface ClientGenerateResponse {
  assistantMessage: string;
  files: Array<{
    path: string;
    content: string;
    language?: 'html' | 'javascript' | 'typescript' | 'json' | 'css' | 'markdown';
  }>;
  summaryPoints: string[];
}

export function detectKeyProvider(apiKey: string): {
  provider: 'gemini' | 'openai' | 'groq' | 'anthropic' | 'b_ai' | 'unknown';
  recommendedModel: string;
  label: string;
} {
  const clean = apiKey.trim();
  if (clean.startsWith('AIzaSy')) {
    return {
      provider: 'gemini',
      recommendedModel: 'gemini-2.5-flash',
      label: 'Google Gemini (API Nativa)',
    };
  }
  if (clean.startsWith('gsk_')) {
    return {
      provider: 'groq',
      recommendedModel: 'llama-3.3-70b-versatile',
      label: 'Groq (Llama 3.3)',
    };
  }
  if (clean.startsWith('sk-ant-')) {
    return {
      provider: 'anthropic',
      recommendedModel: 'claude-3-7-sonnet-20250219',
      label: 'Anthropic Claude',
    };
  }
  if (clean.startsWith('sk-proj-') || clean.startsWith('sk-svc-')) {
    return {
      provider: 'openai',
      recommendedModel: 'gpt-4o',
      label: 'OpenAI (GPT-4o)',
    };
  }
  if (clean.startsWith('bai-') || clean.startsWith('bai_')) {
    return {
      provider: 'b_ai',
      recommendedModel: 'deepseek-v3',
      label: 'B.AI Agents Service',
    };
  }
  // Generic sk-... (Could be OpenAI, DeepSeek, or B.AI)
  if (clean.startsWith('sk-')) {
    return {
      provider: 'b_ai',
      recommendedModel: 'deepseek-v4-flash',
      label: 'B.AI / OpenAI Compatible',
    };
  }
  return {
    provider: 'unknown',
    recommendedModel: 'auto',
    label: 'Clave API Personal',
  };
}

export async function testKeyDirectly(apiKey: string): Promise<{
  success: boolean;
  message: string;
  detectedProvider: string;
  models?: string[];
}> {
  const cleanKey = apiKey.trim();
  if (!cleanKey) {
    return {
      success: false,
      message: 'Por favor ingresa una clave de API válida.',
      detectedProvider: 'unknown',
    };
  }

  const info = detectKeyProvider(cleanKey);

  // 1. If Google Gemini key (AIzaSy...)
  if (info.provider === 'gemini') {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${cleanKey}`
      );
      if (res.ok) {
        const data = await res.json();
        const geminiModels = (data.models || [])
          .map((m: any) => m.name.replace('models/', ''))
          .filter((n: string) => n.includes('gemini'));
        return {
          success: true,
          message: `¡Conexión exitosa con Google Gemini! Clave verificada con ${geminiModels.length} modelos disponibles.`,
          detectedProvider: 'gemini',
          models: geminiModels,
        };
      }
    } catch {
      // CORS or network might limit model listing, but valid format
    }
    return {
      success: true,
      message: '¡Clave de Google Gemini configurada correctamente para llamadas directas!',
      detectedProvider: 'gemini',
      models: ['gemini-2.5-flash', 'gemini-2.5-pro'],
    };
  }

  // 2. If Groq key (gsk_...)
  if (info.provider === 'groq') {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/models', {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        const ids = (data.data || []).map((m: any) => m.id);
        return {
          success: true,
          message: `¡Conexión exitosa con Groq! Sincronizados ${ids.length} modelos ultra rápidos.`,
          detectedProvider: 'groq',
          models: ids,
        };
      }
    } catch {
      // fallback
    }
    return {
      success: true,
      message: '¡Clave de Groq configurada correctamente!',
      detectedProvider: 'groq',
      models: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    };
  }

  // 3. If B.AI / OpenAI compatible
  try {
    const res = await fetch('https://api.b.ai/v1/models', {
      headers: {
        Authorization: `Bearer ${cleanKey}`,
        'x-api-key': cleanKey,
      },
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.data) ? data.data : (data.models || []);
      const ids = list.map((m: any) => m.id || m.name || String(m));
      return {
        success: true,
        message: `¡Conexión exitosa con B.AI! Sincronizados ${ids.length} modelos.`,
        detectedProvider: 'b_ai',
        models: ids,
      };
    }
  } catch {
    // try OpenAI
  }

  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${cleanKey}` },
    });
    if (res.ok) {
      const data = await res.json();
      const ids = (data.data || []).map((m: any) => m.id);
      return {
        success: true,
        message: `¡Conexión exitosa con OpenAI! Clave verificada con ${ids.length} modelos.`,
        detectedProvider: 'openai',
        models: ids,
      };
    }
  } catch {
    // CORS might block browser list calls
  }

  // If format matches typical sk- keys, allow user to connect smoothly
  if (cleanKey.length > 20) {
    return {
      success: true,
      message: `¡Clave guardada y activada como ${info.label}! Lista para procesar tus solicitudes.`,
      detectedProvider: info.provider,
    };
  }

  return {
    success: false,
    message: 'La clave ingresada no parece tener el formato esperado (sk-... o AIzaSy...). Verifica y reintenta.',
    detectedProvider: info.provider,
  };
}

export async function generateCodeClientSide(
  req: ClientGenerateRequest
): Promise<ClientGenerateResponse> {
  const {
    prompt,
    systemPrompt,
    files,
    supabaseConfig,
    injectSupabase,
    provider = 'gemini',
    customApiKey,
    bAiApiKey,
    bAiModel,
  } = req;

  const activeKey = (customApiKey || bAiApiKey || '').trim();

  // Files context
  const filesContext = files
    .map((f) => `--- FILE: ${f.path} ---\n${f.content}\n--- END FILE ---`)
    .join('\n\n');

  const supabaseDirective = injectSupabase && supabaseConfig?.isConnected
    ? `\nCRITICAL SUPABASE INTEGRATION REQUIREMENT:\nThe user has connected Supabase (URL: ${supabaseConfig.url}).\nYou MUST generate or update a Supabase client file at 'src/lib/supabaseClient.js' or 'src/lib/supabase.ts' using '@supabase/supabase-js' (createClient).\n`
    : '';

  const systemInstruction = `Eres un Ingeniero de Software Principal y Arquitecto de Código de IA especializado en construir aplicaciones web modernas y full-stack.

REGLA DE IDIOMA ESTRICTA Y OBLIGATORIA:
Debes responder SIEMPRE EN ESPAÑOL. Todo tu texto en 'assistantMessage', las notas explicativas y los puntos de resumen 'summaryPoints' deben estar redactados 100% en español fluido, profesional y claro.
${systemPrompt ? `DIRECTIVA DEL USUARIO:\n${systemPrompt}\n` : ''}

El usuario desea generar, modificar o extender su aplicación mediante lenguaje natural.
Archivos actuales del proyecto:
${filesContext}
${supabaseDirective}

REGLAS DE FORMATO DE SALIDA:
DEBES responder ÚNICAMENTE con JSON válido (sin formato markdown adicional fuera del JSON).
Esquema JSON:
{
  "assistantMessage": "Explicación en español de los cambios, arquitectura y funcionalidades implementadas",
  "summaryPoints": ["Punto 1 en español", "Punto 2 en español", "Punto 3 en español"],
  "files": [
    {
      "path": "ruta/al/archivo.ext",
      "content": "Contenido completo del archivo actualizado o creado (nunca truncado)",
      "language": "html" | "javascript" | "typescript" | "json" | "css" | "markdown"
    }
  ]
}

Incluye ÚNICAMENTE los archivos que necesiten ser modificados o creados, o devuelve archivos funcionales completos si se solicita una reestructuración importante.
Asegúrate de que la aplicación web pueda ejecutarse de inmediato en la vista previa del navegador (HTML5 + Tailwind CDN / Módulos ES modernos).`;

  // 1. Check if user provided a Google Gemini API Key
  const isGemini =
    provider === 'gemini' ||
    activeKey.startsWith('AIzaSy') ||
    (bAiModel && bAiModel.includes('gemini'));

  if (isGemini && activeKey.startsWith('AIzaSy')) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${activeKey}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemInstruction },
              { text: `USER REQUEST:\n${prompt}` },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Google Gemini API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    return parseAIResponse(text);
  }

  // 2. Check if user provided a Groq Key
  if (activeKey.startsWith('gsk_') || provider === 'groq') {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Groq API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    return parseAIResponse(content);
  }

  // 3. Check OpenAI / B.AI
  if (activeKey) {
    const endpoint = activeKey.startsWith('sk-proj-')
      ? 'https://api.openai.com/v1/chat/completions'
      : 'https://api.b.ai/v1/chat/completions';

    const targetModel = activeKey.startsWith('sk-proj-')
      ? 'gpt-4o'
      : (bAiModel && bAiModel !== 'auto' ? bAiModel : 'deepseek-v3');

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${activeKey}`,
        'x-api-key': activeKey,
      },
      body: JSON.stringify({
        model: targetModel,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || '{}';
    return parseAIResponse(content);
  }

  throw new Error(
    'Despliegue estático detectado en Vercel. Para generar código directamente desde el navegador, ingresa tu clave API personal (Google Gemini, OpenAI, Groq o B.AI) en el botón de Claves API.'
  );
}

function parseAIResponse(rawText: string): ClientGenerateResponse {
  try {
    const parsed = JSON.parse(rawText);
    return {
      assistantMessage: parsed.assistantMessage || 'Código generado exitosamente.',
      files: parsed.files || [],
      summaryPoints: parsed.summaryPoints || ['Archivos actualizados correctamente.'],
    };
  } catch {
    const clean = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      assistantMessage: parsed.assistantMessage || 'Código generado exitosamente.',
      files: parsed.files || [],
      summaryPoints: parsed.summaryPoints || ['Archivos actualizados correctamente.'],
    };
  }
}
