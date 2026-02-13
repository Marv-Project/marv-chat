import { ORPCError, os } from '@orpc/server'
import { baseLogger } from '@marv-chat/shared'
import type { ORPCContext } from './context'

export const o = os.$context<ORPCContext>()

const timingMiddleware = o.middleware(async ({ next, path }) => {
  const start = Date.now()

  try {
    return await next()
  } finally {
    baseLogger.info(
      { path: path.join('/'), duration: Date.now() - start },
      '[ORPC]: executed',
    )
  }
})

const requireAuth = o.middleware(async ({ next, context }) => {
  if (!context.auth) {
    baseLogger.error('[ORPC]: User tried to access protected route')

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
