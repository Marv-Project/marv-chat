import { z } from 'zod'
import type { AppUIMessage } from '@/lib/ai-sdk/types'
import { protectedProcedure } from '@/orpc'
import { generateTitle } from '@/utils'

export const getAllChat = protectedProcedure.handler(async ({ context }) => {
  const chats = await context.prisma.chat.findMany({
    where: { userId: context.auth.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return chats
})

export const deleteChat = protectedProcedure
  .input(z.object({ chatId: z.string() }))
  .handler(async ({ context, input }) => {
    const chat = await context.prisma.chat.delete({
      where: { id: input.chatId },
    })

    return chat
  })

export const gentTitle = protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
      message: z.custom<AppUIMessage>(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { chatId, message } = input

    const title = await generateTitle(message)

    const updatedChat = await context.prisma.chat.update({
      where: { id: chatId },
      data: { title },
    })

    return updatedChat
  })
