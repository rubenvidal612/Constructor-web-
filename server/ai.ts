import { GoogleGenAI } from '@google/genai';

export interface GenerateCodeRequest {
  prompt: string;
  systemPrompt?: string;
  files: { path: string; content: string; language: string }[];
  supabaseConfig?: { url: string; anonKey: string; isConnected: boolean };
  injectSupabase?: boolean;
  provider?: 'gemini' | 'b_ai' | 'deepseek' | 'groq' | 'custom';
  customEndpoint?: string;
  customApiKey?: string;
  customModel?: string;
  bAiApiKey?: string;
  bAiModel?: string;
}

export interface GeneratedCodeResponse {
  assistantMessage: string;
  files: { path: string; content: string; language: string }[];
  summaryPoints: string[];
}

export async function fetchBAiModels(apiKey?: string): Promise<any[]> {
  const key = apiKey || process.env.B_AI_API_KEY;
  if (!key) {
    throw new Error('API Key requerida para sincronizar modelos disponibles');
  }
  const res = await fetch('https://api.b.ai/v1/models', {
    headers: {
      Authorization: `Bearer ${key}`,
      'x-api-key': key,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`B.AI /v1/models error (${res.status}): ${err}`);
  }
  const data = await res.json();
  if (Array.isArray(data.data)) return data.data;
  if (Array.isArray(data.models)) return data.models;
  if (Array.isArray(data)) return data;
  return [];
}

export async function callGeminiAPI(
  systemInstruction: string,
  prompt: string,
  targetModel: string = 'gemini-2.5-flash',
  customApiKey?: string
): Promise<GeneratedCodeResponse> {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY no está configurada en el servidor.');
  }

  const ai = new GoogleGenAI({ apiKey });

  // Use gemini-2.5-flash by default for fast, free execution; use pro if customApiKey is provided
  const isPro = targetModel.toLowerCase().includes('pro') && !!customApiKey;
  const primaryModel = isPro ? 'gemini-2.5-pro' : 'gemini-2.5-flash';

  let responseText = '';
  try {
    const response = await ai.models.generateContent({
      model: primaryModel,
      contents: [
        {
          role: 'user',
          parts: [
            { text: systemInstruction },
            { text: `USER REQUEST:\n${prompt}` },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });
    responseText = response.text || '{}';
  } catch (err: any) {
    // If quota exceeded (429) or pro model fails, fallback seamlessly to gemini-2.5-flash
    if (primaryModel !== 'gemini-2.5-flash') {
      console.warn(`Fallback to gemini-2.5-flash due to: ${err.message}`);
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: systemInstruction },
              { text: `USER REQUEST:\n${prompt}` },
            ],
          },
        ],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });
      responseText = fallbackResponse.text || '{}';
    } else {
      throw err;
    }
  }

  try {
    const parsed = JSON.parse(responseText);
    return {
      assistantMessage: parsed.assistantMessage || 'Aplicación actualizada según lo solicitado.',
      files: parsed.files || [],
      summaryPoints: parsed.summaryPoints || ['Componentes y diseño actualizados en español.'],
    };
  } catch {
    const clean = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(clean);
    return {
      assistantMessage: parsed.assistantMessage || 'Aplicación actualizada correctamente.',
      files: parsed.files || [],
      summaryPoints: parsed.summaryPoints || [],
    };
  }
}

export async function generateCodeWithLLM(req: GenerateCodeRequest): Promise<GeneratedCodeResponse> {
  const {
    prompt,
    systemPrompt,
    files,
    supabaseConfig,
    injectSupabase,
    provider = 'gemini',
    customEndpoint,
    customApiKey,
    customModel,
    bAiApiKey,
    bAiModel,
  } = req;

  // Build project context string
  const filesContext = files
    .map((f) => `--- FILE: ${f.path} ---\n${f.content}\n--- END FILE ---`)
    .join('\n\n');

  const supabaseDirective = injectSupabase && supabaseConfig?.isConnected
    ? `
CRITICAL SUPABASE INTEGRATION REQUIREMENT:
The user has connected Supabase (URL: ${supabaseConfig.url}).
You MUST generate or update a Supabase client file at 'src/lib/supabaseClient.js' or 'src/lib/supabase.ts' using '@supabase/supabase-js' (createClient), and wire up actual database queries or realtime subscriptions matching the user's prompt.
`
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

  const isGeminiModel =
    provider === 'gemini' ||
    (bAiModel && bAiModel.toLowerCase().includes('gemini')) ||
    (customModel && customModel.toLowerCase().includes('gemini'));

  // Option 1: Native Google Gemini API (100% Free & Built-in with generous tier)
  if (isGeminiModel) {
    try {
      const targetModel = bAiModel || customModel || 'gemini-2.5-flash';
      return await callGeminiAPI(systemInstruction, prompt, targetModel, customApiKey);
    } catch (err: any) {
      console.warn('Direct Gemini API call failed, falling back to gemini-2.5-flash:', err.message);
      return await callGeminiAPI(systemInstruction, prompt, 'gemini-2.5-flash');
    }
  }

  // Option 2: B.AI Agents & LLM Service Gateway (https://docs.b.ai/llmservice/api/)
  if (provider === 'b_ai') {
    const key = bAiApiKey || customApiKey || process.env.B_AI_API_KEY;

    if (!key) {
      // Fallback seamlessly to native Google Gemini
      return await callGeminiAPI(systemInstruction, prompt, 'gemini-2.5-flash');
    }

    const endpoint = 'https://api.b.ai/v1/chat/completions';
    const rawModelChoice = bAiModel || customModel || 'deepseek-v4-flash';
    const isAutoMode = rawModelChoice === 'auto';

    // Intelligent task analysis for dynamic model routing
    let dynamicModel = 'deepseek-v4-flash';
    let dynamicLabel = 'DeepSeek-V4-Flash (Baja latencia y renderizado ágil)';

    if (isAutoMode) {
      const pLower = prompt.toLowerCase();
      const isComplexReasoning =
        pLower.includes('algoritmo') ||
        pLower.includes('arquitectura') ||
        pLower.includes('complej') ||
        pLower.includes('razonamiento') ||
        pLower.includes('matemátic') ||
        pLower.includes('optimiza') ||
        pLower.includes('auth') ||
        pLower.includes('seguridad') ||
        pLower.includes('database') ||
        pLower.includes('base de datos') ||
        pLower.includes('backend');

      const isHeavyCode =
        pLower.includes('refactor') ||
        pLower.includes('typescript') ||
        pLower.includes('api') ||
        pLower.includes('estado') ||
        pLower.includes('crud') ||
        pLower.includes('interfaz') ||
        pLower.includes('componente');

      if (isComplexReasoning) {
        dynamicModel = 'deepseek-r1';
        dynamicLabel = 'Razonamiento lógico avanzado y arquitectura';
      } else if (isHeavyCode) {
        dynamicModel = 'deepseek-v3';
        dynamicLabel = 'Especialista en código y lógica de componentes';
      } else {
        dynamicModel = 'deepseek-v4-flash';
        dynamicLabel = 'Iteración ágil y ajustes de interfaz';
      }
    }

    // Try target model (either 'auto' or dynamically routed model)
    const targetModel = isAutoMode ? dynamicModel : rawModelChoice;

    try {
      let res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
          'x-api-key': key,
        },
        body: JSON.stringify({
          model: targetModel,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: systemInstruction },
            { role: 'user', content: prompt },
          ],
          temperature: 0.2,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`B.AI returned ${res.status}: ${errText}. Falling back to native Google Gemini.`);
        // Gracefully fallback to Google Gemini so the user never sees 404 or credit errors
        const fallbackResult = await callGeminiAPI(systemInstruction, prompt, 'gemini-2.5-flash');
        fallbackResult.summaryPoints.unshift(`⚡ Generado con Google Gemini 2.5 Flash (Fallback automático gratuito).`);
        return fallbackResult;
      }

      const data = await res.json();
      const rawContent = data.choices?.[0]?.message?.content || '{}';
      const usedModelNotice = isAutoMode
        ? `⚡ [Modo Auto]: Optimizado automáticamente (${dynamicLabel}).`
        : '';

      try {
        const parsed = JSON.parse(rawContent);
        const points = parsed.summaryPoints || ['Archivos de la aplicación actualizados correctamente.'];
        if (usedModelNotice && !points.includes(usedModelNotice)) {
          points.unshift(usedModelNotice);
        }
        return {
          assistantMessage: parsed.assistantMessage || 'Código generado exitosamente con el Agente de IA.',
          files: parsed.files || [],
          summaryPoints: points,
        };
      } catch {
        const clean = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(clean);
        const points = parsed.summaryPoints || ['Archivos de la aplicación actualizados correctamente.'];
        if (usedModelNotice && !points.includes(usedModelNotice)) {
          points.unshift(usedModelNotice);
        }
        return {
          assistantMessage: parsed.assistantMessage || 'Código generado exitosamente con el Agente de IA.',
          files: parsed.files || [],
          summaryPoints: points,
        };
      }
    } catch (err: any) {
      console.warn('B.AI fetch failed, falling back to Google Gemini:', err.message);
      return await callGeminiAPI(systemInstruction, prompt, 'gemini-2.5-flash');
    }
  }

  // Option 2: Custom DeepSeek / Groq compatible endpoint if specified
  if (provider !== 'gemini' && customEndpoint && customApiKey) {
    const endpoint = customEndpoint.endsWith('/chat/completions')
      ? customEndpoint
      : `${customEndpoint.replace(/\/$/, '')}/chat/completions`;

    const modelName = customModel || (provider === 'groq' ? 'llama-3.3-70b-versatile' : 'deepseek-chat');

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customApiKey}`,
      },
      body: JSON.stringify({
        model: modelName,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Custom LLM provider returned ${res.status}: ${errText}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || '{}';
    try {
      const parsed = JSON.parse(rawContent);
      return {
        assistantMessage: parsed.assistantMessage || 'Código actualizado exitosamente.',
        files: parsed.files || [],
        summaryPoints: parsed.summaryPoints || ['Archivos de la aplicación actualizados.'],
      };
    } catch {
      throw new Error('No se pudo procesar la respuesta JSON del proveedor LLM personalizado.');
    }
  }

  // Default Fallback: Native Google Gemini API (gemini-2.5-flash)
  return await callGeminiAPI(systemInstruction, prompt, 'gemini-2.5-flash', customApiKey);
}
