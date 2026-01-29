import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { RPCHandler } from '@orpc/server/fetch'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { createFileRoute } from '@tanstack/react-router'
import { SmartCoercionPlugin } from '@orpc/json-schema'
import { orpcRouter } from '@/orpc/routers'
import { createORPCContext } from '@/orpc/context'
import { logger } from '@/lib/logger'

const rpcHandler = new RPCHandler(orpcRouter, {
  interceptors: [
    onError((error) => {
      logger.error({ err: error }, 'oRPC handler error')
    }),
  ],
})

const apiHandler = new OpenAPIHandler(orpcRouter, {
  interceptors: [
    onError((error) => {
      logger.error({ err: error }, 'oRPC handler error')
    }),
  ],

  plugins: [
    new SmartCoercionPlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
    }),

    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'MarvChat ORPC API Reference',
          version: '1.0.0',
          description: 'API Reference for ORPC MarvChat',
        },
        commonSchemas: {
          UndefinedError: { error: 'UndefinedError' },
        },
        security: [{ apiKeyCookie: [], bearerAuth: [] }],
        components: {
          securitySchemes: {
            apiKeyCookie: {
              type: 'apiKey',
              in: 'cookie',
              name: 'apiKeyCookie',
              description: 'API Key authentication via cookie',
            },
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              description: 'Bearer token authentication',
            },
          },
        },
      },
      docsConfig: {
        authentication: {
          securitySchemes: {
            apiKeyCookie: {},
            bearerAuth: {},
          },
        },
      },
    }),
  ],
})

const createContext = async (req: Request) => {
  return createORPCContext({ headers: req.headers })
}

async function handle({ request }: { request: Request }) {
  logger.info({ method: request.method, path: new URL(request.url).pathname }, 'Request received')
  const context = await createContext(request)

  const rpcResult = await rpcHandler.handle(request, {
    prefix: '/api/orpc',
    context,
  })
  if (rpcResult.response) return rpcResult.response

  const apiResult = await apiHandler.handle(request, {
    prefix: '/api/orpc/reference',
    context,
  })
  if (apiResult.response) return apiResult.response

  return new Response('Not found', { status: 404 })
}

export const Route = createFileRoute('/api/orpc/$')({
  server: {
    handlers: {
      HEAD: handle,
      GET: handle,
      POST: handle,
      PUT: handle,
      PATCH: handle,
      DELETE: handle,
    },
  },
})
