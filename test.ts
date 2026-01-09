import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { streamText } from 'ai'
import { env } from '@/configs/env'

const openrouter = createOpenRouter({
  apiKey: env.OPENROUTER_API_KEY,
})

const model = openrouter('deepseek/deepseek-r1-0528:free')

const main = async (prompt: string) => {
  const { reasoning } = streamText({
    model,
    messages: [{ role: 'user', content: prompt }],
  })

  console.log(await reasoning)

  // for (const chunk of await result.reasoningText) {
  //   console.log(chunk)
  // }
}

void main(`Apa itu OpenRouter?`)
