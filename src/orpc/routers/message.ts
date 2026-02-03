import { z } from 'zod'
import { and, asc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { messageTable, threadTable } from '@/lib/db/schemas'
import { protectedProcedure } from '@/orpc'

export const getMessages = protectedProcedure
  .input(
    z.object({
      threadId: z.uuid(),
    }),
  )
  .handler(async ({ context, input }) => {
    const { threadId } = input

    // Fetch messages in chronological order (oldest first)
    const messages = await db
      .select({
        id: messageTable.id,
        role: messageTable.role,
        parts: messageTable.parts,
        metadata: messageTable.metadata,
        createdAt: messageTable.createdAt,
        updatedAt: messageTable.updatedAt,
      })
      .from(messageTable)
      .innerJoin(threadTable, eq(messageTable.threadId, threadTable.id))
      .where(
        and(
          eq(messageTable.threadId, threadId),
          eq(threadTable.userId, context.auth.user.id),
        ),
      )
      .orderBy(asc(messageTable.createdAt)) // asc = oldest → newest (bottom)

    // Parse and validate the data to ensure proper types
    return messages
  })
