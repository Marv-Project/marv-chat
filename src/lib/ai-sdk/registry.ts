import { createProviderRegistry, gateway } from 'ai'
import { google, ollama, openrouter } from '@/lib/ai-sdk/providers'

export const registry = createProviderRegistry(
  {
    google,
    ollama,
    openrouter,
    gateway,
  },
  { separator: ' > ' },
)

// registry.languageModel('')
