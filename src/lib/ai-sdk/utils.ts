import { generateText } from 'ai'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { registry } from '@/lib/ai-sdk/registry'

const titlePrompt = `Generate a very short chat title (2-5 words max) based on the user's message.
Rules:
- Maximum 30 characters
- No quotes, colons, hashtags, or markdown
- Just the topic/intent, not a full sentence
- If the message is a greeting like "hi" or "hello", respond with just "New conversation"
- Be concise: "Weather in NYC" not "User asking about the weather in New York City"`

function getTextFromMessage(message: AppUIMessage): string {
  return message.parts
    .filter((part) => part.type === 'text')
    .map((part) => (part as { type: 'text'; text: string }).text)
    .join('')
}

export const generateTitleFromUserMessage = async ({
  message,
}: {
  message: AppUIMessage
}) => {
  const prompt = getTextFromMessage(message)
  if (!prompt.trim()) {
    return 'New conversation'
  }

  try {
    const { text: title } = await generateText({
      model: registry.languageModel('ollama:gpt-oss:120b'),
      system: titlePrompt,
      prompt,
    })

    return title
  } catch (error) {
    console.error('Failed to generate title:', error)
    return 'New conversation'
  }
}
