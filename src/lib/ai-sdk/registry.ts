import { createOllama } from 'ollama-ai-provider-v2'
import { createProviderRegistry } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { google } from '@/lib/ai-sdk/providers'

export const ollama = createOllama({
  baseURL: 'https://ollama.com/api',
  headers: {
    Authorization: `Bearer ${process.env.OLLAMA_API_KEY}`,
  },
})

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

export const registry = createProviderRegistry(
  {
    google,
    ollama,
    openrouter,
  },
  { separator: '::' },
)
