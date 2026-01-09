import { createOllama } from 'ai-sdk-ollama'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { env } from '@/configs/env'

export const ollama = createOllama({
  baseURL: 'https://ollama.com',
  apiKey: env.OLLAMA_API_KEY,
})

export const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})
