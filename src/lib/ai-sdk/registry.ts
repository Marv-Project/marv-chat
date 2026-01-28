import { createOllama } from 'ollama-ai-provider-v2'
import { createProviderRegistry } from 'ai'
import { google } from '@/lib/ai-sdk/providers'
import { env } from '@/configs/env'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

export const ollama = createOllama({
  baseURL: 'https://ollama.com/api',
  headers: {
    Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
  },
})

export const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

export const registry = createProviderRegistry(
  {
    google,
    ollama,
    openrouter,
  },
  { separator: ':' },
)
