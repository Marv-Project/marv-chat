import { ORPCError, os } from '@orpc/server'
import type { ORPCContext } from '@/orpc/context'

export const o = os.$context<ORPCContext>()

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

export const publicProcedure = o.use(requireAuth)

export const protectedProcedure = o.use(requireAuth)
