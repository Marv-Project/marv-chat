import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@marv-chat/auth/server'
import { baseLogger } from '@marv-chat/shared'

const logger = baseLogger.child({ module: 'auth' })

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        logger.info(
          { method: 'GET', path: '/api/auth' },
          '[API ROUTE]: Request received',
        )
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        logger.info(
          { method: 'POST', path: '/api/auth' },
          '[API ROUTE]: Request received',
        )
        return await auth.handler(request)
      },
    },
  },
})
