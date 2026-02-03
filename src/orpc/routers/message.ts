import { z } from 'zod'
import { asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { messageTable } from '@/lib/db/schemas'
import { protectedProcedure } from '@/orpc'

export const getMessages = protectedProcedure
  .input(
    z.object({
      threadId: z.uuid(),
    }),
  )
  .handler(async ({ input }) => {
    const { threadId } = input

    // Fetch messages in chronological order (oldest first)
    const messages = await db
      .select()
      .from(messageTable)
      .where(eq(messageTable.threadId, threadId))
      .orderBy(asc(messageTable.createdAt)) // asc = oldest → newest (bottom)

    // Return with explicit structure (parts is stored as JSON in DB)
    return messages.map((m) => ({
      id: m.id,
      role: m.role,
      parts: m.parts,
      metadata: m.metadata,
    }))
  })
