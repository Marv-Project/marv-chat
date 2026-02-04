export type AIProvider = 'google' | 'ollama' | 'openrouter' | 'gateway'

interface AIProviderConfig {
  id: string
  name: string
  models: AIChatModelConfig[]
}

interface AIChatModelConfig {
  id: string
  providerId: AIProvider
  name: string
  uiName: string
}

export const aiChatModelsConfig: AIProviderConfig[] = [
  {
    id: 'google',
    name: 'Google',
    models: [
      {
        id: 'gemini-2.5-flash',
        providerId: 'google',
        name: 'Gemini 2.5 Flash',
        uiName: 'Gemini 2.5 Flash',
      },
      {
        id: 'gemini-2.5-flash-lite',
        providerId: 'google',
        name: 'Gemini 2.5 Flash Lite',
        uiName: 'Gemini 2.5 Flash Lite',
      },
      {
        id: 'gemini-2.5-flash-reasoning',
        providerId: 'google',
        name: 'Gemini 2.5 Flash (Reasoning)',
        uiName: 'Gemini 2.5 Flash',
      },
      {
        id: 'gemini-2.5-flash-lite-reasoning',
        providerId: 'google',
        name: 'Gemini 2.5 Flash Lite (Reasoning)',
        uiName: 'Gemini 2.5 Flash Lite',
      },
    ],
  },

  {
    id: 'ollama',
    name: 'Ollama',
    models: [
      {
        id: 'kimi-k2.5',
        providerId: 'ollama',
        name: 'Kimi K2.5',
        uiName: 'Kimi K2.5',
      },
      {
        id: 'deepseek-v3.1:671b',
        providerId: 'ollama',
        name: 'DeepSeek V3.1 671B',
        uiName: 'DeepSeek V3.1 671B',
      },
      {
        id: 'deepseek-v3.2',
        providerId: 'ollama',
        name: 'DeepSeek V3.2',
        uiName: 'DeepSeek V3.2',
      },
    ],
  },

  {
    id: 'gateway',
    name: 'Vercel Gateway',
    models: [
      // Anthropic
      {
        id: 'anthropic/claude-haiku-4.5',
        name: 'Claude Haiku 4.5',
        providerId: 'gateway',
        uiName: 'Claude Haiku 4.5',
      },
      {
        id: 'anthropic/claude-sonnet-4.5',
        name: 'Claude Sonnet 4.5',
        providerId: 'gateway',
        uiName: 'Claude Sonnet 4.5',
      },
      {
        id: 'anthropic/claude-opus-4.5',
        name: 'Claude Opus 4.5',
        providerId: 'gateway',
        uiName: 'Claude Opus 4.5',
      },
      // OpenAI
      {
        id: 'openai/gpt-4.1-mini',
        name: 'GPT-4.1 Mini',
        providerId: 'gateway',
        uiName: 'GPT-4.1 Mini',
      },
      {
        id: 'openai/gpt-5.2',
        name: 'GPT-5.2',
        providerId: 'gateway',
        uiName: 'GPT-5.2',
      },
      // Google
      {
        id: 'google/gemini-2.5-flash-lite',
        name: 'Gemini 2.5 Flash Lite',
        providerId: 'gateway',
        uiName: 'Gemini 2.5 Flash Lite',
      },
      {
        id: 'google/gemini-3-pro-preview',
        name: 'Gemini 3 Pro',
        providerId: 'gateway',
        uiName: 'Gemini 3 Pro',
      },
      // xAI
      {
        id: 'xai/grok-4.1-fast-non-reasoning',
        name: 'Grok 4.1 Fast',
        providerId: 'gateway',
        uiName: 'Grok 4.1 Fast',
      },
    ],
  },
]

export const aiChatModels = aiChatModelsConfig.flatMap((provider) =>
  provider.models.map((model) => ({
    ...model,
    providerId: provider.id,
  })),
)

export const getModelName = (modelId: string): string => {
  const model = aiChatModels.find((m) => m.id === modelId)
  return model?.name ?? modelId
}

export const DEFAULT_CHAT_MODEL = 'google/gemini-2.5-flash-lite'

type FullChatModelId = `${AIProvider} > ${AIChatModelConfig['id']}`

export const getFullChatModelId = (modelId: string): FullChatModelId => {
  const SEPARATOR = ' > '

  const selectedModel = aiChatModels.find((model) => model.id === modelId)

  if (!selectedModel) {
    throw new Error(`Model ${modelId} not found`)
  }

  const selectedProvider = aiChatModelsConfig.find(
    (provider) => provider.id === selectedModel.providerId,
  )

  if (!selectedProvider) {
    throw new Error(`Provider ${selectedModel.providerId} not found`)
  }

  return `${selectedProvider.id}${SEPARATOR}${selectedModel.id}` as FullChatModelId
}
