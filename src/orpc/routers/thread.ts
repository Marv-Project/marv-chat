import { and, desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { ORPCError } from '@orpc/server'
import { db } from '@/lib/db'
import { threadTable } from '@/lib/db/schemas'
import { protectedProcedure } from '@/orpc'
import { branchThread as branchThreadQuery } from '@/lib/db/queries/thread.query'

export const getThreads = protectedProcedure.handler(async ({ context }) => {
  const threads = await db
    .select()
    .from(threadTable)
    .where(eq(threadTable.userId, context.auth.user.id))
    .orderBy(desc(threadTable.updatedAt))

  return threads
})

export const getThread = protectedProcedure
  .input(z.object({ threadId: z.uuid() }))
  .handler(async ({ context, input }) => {
    const [thread] = await db
      .select()
      .from(threadTable)
      .where(
        and(
          eq(threadTable.id, input.threadId),
          eq(threadTable.userId, context.auth.user.id),
        ),
      )
      .limit(1)

    if (!thread) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Thread not found',
      })
    }

    return thread
  })

export const renameThread = protectedProcedure
  .input(z.object({ threadId: z.uuid(), title: z.string().trim().min(1) }))
  .handler(async ({ context, input }) => {
    const [thread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.id, input.threadId))
      .limit(1)

    if (!thread) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Thread not found',
      })
    }

    if (thread.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to rename this thread',
      })
    }

    const [updatedThread] = await db
      .update(threadTable)
      .set({ title: input.title })
      .where(eq(threadTable.id, input.threadId))
      .returning()

    return updatedThread
  })

export const togglePinThread = protectedProcedure
  .input(z.object({ threadId: z.uuid() }))
  .handler(async ({ context, input }) => {
    const [thread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.id, input.threadId))
      .limit(1)

    if (!thread) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Thread not found',
      })
    }

    if (thread.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to pin this thread',
      })
    }

    const [updatedThread] = await db
      .update(threadTable)
      .set({ isPinned: !thread.isPinned })
      .where(eq(threadTable.id, input.threadId))
      .returning()

    return updatedThread
  })

export const deleteThread = protectedProcedure
  .input(z.object({ threadId: z.uuid() }))
  .handler(async ({ context, input }) => {
    const [thread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.id, input.threadId))
      .limit(1)

    if (!thread) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Thread not found',
      })
    }

    if (thread.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to delete this thread',
      })
    }

    await db.delete(threadTable).where(eq(threadTable.id, input.threadId))

    return thread
  })

export const branchThread = protectedProcedure
  .input(
    z.object({ threadId: z.string(), messageIndex: z.number().int().min(0) }),
  )
  .handler(async ({ context, input }) => {
    const [thread] = await db
      .select()
      .from(threadTable)
      .where(eq(threadTable.id, input.threadId))
      .limit(1)

    if (!thread) {
      throw new ORPCError('NOT_FOUND', {
        message: 'Thread not found',
      })
    }

    if (thread.userId !== context.auth.user.id) {
      throw new ORPCError('FORBIDDEN', {
        message: 'You do not have permission to branch this thread',
      })
    }

    const newThread = await branchThreadQuery({
      sourceThreadId: input.threadId,
      messageIndex: input.messageIndex,
      userId: context.auth.user.id,
    })

    return newThread
  })
