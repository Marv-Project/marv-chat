import type { PromptInputMessage } from '@/components/ai-elements/prompt-input'

declare module '@tanstack/react-router' {
  interface HistoryState {
    initialPrompt?: PromptInputMessage
  }
}
