import { createOllama } from 'ollama-ai-provider-v2'
import { createProviderRegistry } from 'ai'
import { env } from '@/configs/env'

export const ollamaV2 = createOllama({
  baseURL: 'https://ollama.com/api',
  headers: {
    Authorization: `Bearer ${env.OLLAMA_API_KEY}`,
  },
})

export const registry = createProviderRegistry(
  {
    ollamaV2,
  },
  { separator: ':' },
)
