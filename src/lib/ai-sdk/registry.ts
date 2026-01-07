import { createOllama } from 'ai-sdk-ollama'
import { env } from '@/configs/env'

export const ollama = createOllama({
  baseURL: 'https://ollama.com',
  apiKey: env.OLLAMA_API_KEY,
})
