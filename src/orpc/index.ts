import { ORPCError, os } from '@orpc/server'
import type { ORPCContext } from '@/orpc/context'
import { logger } from '@/lib/logger'

export const o = os.$context<ORPCContext>()

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now()

  try {
    return await next()
  } finally {
    logger.info(
      { path: path.join('/'), duration: Date.now() - start },
      '[oRPC] executed',
    )
  }
})

const requireAuth = o.middleware(async ({ next, context }) => {
  if (!context.auth) {
    throw new ORPCError('UNAUTHORIZED', {
      message: 'You are not authenticated',
    })
  }

  return next({
    context: {
      ...context,
      auth: {
        ...context.auth,
      },
    },
  })
})

export const publicProcedure = o.use(timingMiddleware)

export const protectedProcedure = o.use(timingMiddleware).use(requireAuth)
