import { z } from 'zod'
import { ORPCError } from '@orpc/server'
import { protectedProcedure } from '@/orpc'
import { branchChat as branchChatQuery } from '@/lib/db/queries/chat.query'

export const getAllChat = protectedProcedure.handler(async ({ context }) => {
  const chats = await context.db.chat.findMany({
    where: { userId: context.auth.user.id },
    orderBy: { updatedAt: 'desc' },
  })

  return chats
})

export const renameChat = protectedProcedure
  .input(z.object({ chatId: z.string(), title: z.string().trim().min(1) }))
  .handler(async ({ context, input }) => {
    const chat = await context.db.chat.findUnique({
      where: { id: input.chatId },
    })

    if (!chat) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Chat not found',
      })
    }

    if (chat.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to rename this chat',
      })
    }

    const updatedChat = await context.db.chat.update({
      where: { id: input.chatId },
      data: { title: input.title },
    })

    return updatedChat
  })

export const togglePinChat = protectedProcedure
  .input(z.object({ chatId: z.string() }))
  .handler(async ({ context, input }) => {
    const chat = await context.db.chat.findUnique({
      where: { id: input.chatId },
    })

    if (!chat) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Chat not found',
      })
    }

    if (chat.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to pin this chat',
      })
    }

    // Use raw SQL to bypass Prisma's @updatedAt auto-update
    await context.db.$executeRaw`
      UPDATE "chats" SET "pinned" = ${!chat.pinned} WHERE "id" = ${input.chatId}
    `

    return { ...chat, pinned: !chat.pinned }
  })

export const deleteChat = protectedProcedure
  .input(z.object({ chatId: z.string() }))
  .handler(async ({ context, input }) => {
    const chat = await context.db.chat.findUnique({
      where: { id: input.chatId },
    })

    if (!chat) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Chat not found',
      })
    }

    if (chat.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to delete this chat',
      })
    }

    await context.db.chat.delete({
      where: { id: input.chatId },
    })

    return chat
  })

export const branchChat = protectedProcedure
  .input(z.object({ chatId: z.string(), messageIndex: z.number().int().min(0) }))
  .handler(async ({ context, input }) => {
    const chat = await context.db.chat.findUnique({
      where: { id: input.chatId },
    })

    if (!chat) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Chat not found',
      })
    }

    if (chat.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to branch this chat',
      })
    }

    const newChat = await branchChatQuery({
      sourceChatId: input.chatId,
      messageIndex: input.messageIndex,
      userId: context.auth.user.id,
    })

    return newChat
  })
