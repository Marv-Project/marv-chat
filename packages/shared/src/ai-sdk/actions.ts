import { generateText } from 'ai'
import { getTitleModel } from './providers'
import { titlePrompt } from './prompts'
import { getTextFromMessage } from './utils'
import type { AppUIMessage } from './types'

export const generateTitleFromUserMessage = async ({
  message,
}: {
  message: AppUIMessage
}) => {
  const { text } = await generateText({
    model: getTitleModel(),
    system: titlePrompt,
    prompt: getTextFromMessage(message),
  })
  return text
    .replace(/^[#*"\s]+/, '')
    .replace(/["]+$/, '')
    .trim()
}
