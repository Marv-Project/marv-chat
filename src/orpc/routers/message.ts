import { z } from 'zod'
import { protectedProcedure } from '@/orpc'

export const getAllMessages = protectedProcedure
  .input(
    z.object({
      chatId: z.string(),
    }),
  )
  .handler(async ({ input, context }) => {
    const { chatId } = input

    // Fetch messages in chronological order (oldest first)
    const messages = await context.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' }, // asc = oldest → newest (bottom)
    })

    // Return with explicit structure (parts is stored as JSON in DB)
    return messages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
      model: m.model,
      metadata: m.metadata,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    }))
  })
