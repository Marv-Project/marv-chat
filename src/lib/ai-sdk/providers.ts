import { google as googleProvider } from '@ai-sdk/google'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import {
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from 'ai'
import { createOllama } from 'ollama-ai-provider-v2'
import type { GoogleGenerativeAIProviderOptions } from '@ai-sdk/google'
import { registry } from '@/lib/ai-sdk/registry'
import { getFullChatModelId } from '@/lib/ai-sdk/config'

export const ollama = createOllama({
  baseURL: 'https://ollama.com/api',
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
})

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const google = customProvider({
  languageModels: {
    'gemini-2.5-flash-reasoning': wrapLanguageModel({
      model: googleProvider('gemini-2.5-flash'),
      providerId: 'google',
      modelId: 'gemini-2.5-flash',
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: 8192,
                includeThoughts: true,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        },
      }),
    }),

    'gemini-2.5-flash': googleProvider('gemini-2.5-flash'),

    'gemini-2.5-flash-lite-reasoning': wrapLanguageModel({
      model: googleProvider('gemini-2.5-flash-lite'),
      providerId: 'google',
      modelId: 'gemini-2.5-flash-lite',
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            google: {
              thinkingConfig: {
                thinkingBudget: 8192,
                includeThoughts: true,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        },
      }),
    }),

    'gemini-2.5-flash-lite': googleProvider('gemini-2.5-flash-lite'),
  },

  fallbackProvider: googleProvider,
})

export const getTitleModel = () => {
  if (process.env.NODE_ENV === 'development') {
    return ollama('gpt-oss:120b')
  }

  return googleProvider('gemini-2.5-flash-lite')
}

export function getLanguageModel(modelId: string) {
  const model = getFullChatModelId(modelId)
  return registry.languageModel(model)
}
