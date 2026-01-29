import { registry } from './registry'

export type AIProvider = 'google' | 'ollama' | 'openrouter'

export const AI_MODELS_CONFIG = [
  {
    id: 'google',
    name: 'Google',
    models: [
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        capabilities: {
          reasoning: false,
          webSearch: true,
        },
      },
      {
        id: 'gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite',
        capabilities: {
          reasoning: false,
          webSearch: true,
        },
      },
      {
        id: 'gemini-2.5-flash-reasoning',
        name: 'Gemini 2.5 Flash (Reasoning)',
        capabilities: {
          reasoning: true,
          webSearch: true,
        },
      },
      {
        id: 'gemini-2.5-flash-lite-reasoning',
        name: 'Gemini 2.5 Flash Lite (Reasoning)',
        capabilities: {
          reasoning: true,
          webSearch: true,
        },
      },
    ],
  },

  {
    id: 'ollama',
    name: 'Ollama',
    models: [
      {
        id: 'kimi-k2.5',
        name: 'Kimi K2.5',
        capabilities: {
          reasoning: true,
          webSearch: false,
        },
      },
      {
        id: 'deepseek-v3.1:671b',
        name: 'DeepSeek V3.1 671B',
        capabilities: {
          reasoning: true,
          webSearch: false,
        },
      },
      {
        id: 'deepseek-v3.2',
        name: 'DeepSeek V3.2',
        capabilities: {
          reasoning: true,
          webSearch: false,
        },
      },
    ],
  },
]

const providerLookup = new Map(
  AI_MODELS_CONFIG.flatMap((p) => p.models.map((m) => [m.id, p.id])),
)

export const getLanguageModel = (modelId: string) => {
  const providerId = providerLookup.get(modelId)
  if (!providerId) throw new Error(`Unknown model ID: ${modelId}`)
  return registry.languageModel(
    `${providerId}:${modelId}` as `${AIProvider}:${string}`,
  )
}

export const getModelName = (modelId: string): string => {
  const providerId = providerLookup.get(modelId)
  if (!providerId) throw new Error(`Unknown model ID: ${modelId}`)
  return (
    AI_MODELS_CONFIG.find((p) => p.id === providerId)?.models.find(
      (m) => m.id === modelId,
    )?.name || modelId
  )
}
