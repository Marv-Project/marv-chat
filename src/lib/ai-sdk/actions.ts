import { generateText } from 'ai'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { getTitleModel } from '@/lib/ai-sdk/providers'
import { titlePrompt } from '@/lib/ai-sdk/prompts'
import { getTextFromMessage } from '@/lib/ai-sdk/utils'

export const generateTitleFromUserMessage = async ({
  message,
}: {
  message: AppUIMessage
}) => {
  const { text } = await generateText({
    model: getTitleModel(),
    system: titlePrompt,
    prompt: getTextFromMessage({ message }),
  })
  return text
    .replace(/^[#*"\s]+/, '')
    .replace(/["]+$/, '')
    .trim()
}
