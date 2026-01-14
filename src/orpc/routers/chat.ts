import { z } from 'zod'
import { protectedProcedure } from '@/orpc'

export const getAllChat = protectedProcedure.handler(async ({ context }) => {
  const chats = await context.db.chat.findMany({
    where: { userId: context.auth.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return chats
})

export const deleteChat = protectedProcedure
  .input(z.object({ chatId: z.string() }))
  .handler(async ({ context, input }) => {
    const chat = await context.db.chat.delete({
      where: { id: input.chatId },
    })

    return chat
  })
