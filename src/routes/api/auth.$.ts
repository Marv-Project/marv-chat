import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@/lib/auth'
import { logger } from '@/lib/logger'

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: async ({ request }: { request: Request }) => {
        logger.info({ method: 'GET', path: '/api/auth' }, 'Request received')
        return await auth.handler(request)
      },
      POST: async ({ request }: { request: Request }) => {
        logger.info({ method: 'POST', path: '/api/auth' }, 'Request received')
        return await auth.handler(request)
      },
    },
  },
})
