import { createOllama } from 'ollama-ai-provider-v2'
import { createProviderRegistry } from 'ai'
import { google } from '@/lib/ai-sdk/providers'
import { env } from '@/configs/env'

export const ollama = createOllama({
  baseURL: 'https://ollama.com/api',
  headers: {
    Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
  },
})

export const registry = createProviderRegistry(
  {
    google,
    ollama,
  },
  { separator: ':' },
)
