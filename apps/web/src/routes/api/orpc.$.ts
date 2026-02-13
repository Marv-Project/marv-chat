import { createFileRoute } from '@tanstack/react-router'
import { onError } from '@orpc/server'
import { orpcRouter } from '@marv-chat/api/routers'
import { baseLogger } from '@marv-chat/shared'
import { RPCHandler } from '@orpc/server/fetch'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { SmartCoercionPlugin } from '@orpc/json-schema'
import { createORPCContext } from '@marv-chat/api/context'

const rpcHandler = new RPCHandler(orpcRouter, {
  interceptors: [
    onError((error) => {
      baseLogger.error({ err: error }, '[ORPC - API Route]: rpc handler error')
    }),
  ],
})

const apiHandler = new OpenAPIHandler(orpcRouter, {
  interceptors: [
    onError((error) => {
      baseLogger.error(
        { err: error },
        '[ORPC - API Route]: openapi handler error',
      )
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
  baseLogger.info(
    { method: request.method, path: new URL(request.url).pathname },
    '[ORPC - API Route]: Request received',
  )

  let context
  try {
    context = await createContext(request)
  } catch (error) {
    baseLogger.error(
      {
        err: error,
        method: request.method,
        path: new URL(request.url).pathname,
      },
      '[ORPC - API Route]: Failed to create context',
    )
    return new Response('Internal Server Error', { status: 500 })
  }

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
      OPTIONS: handle,
    },
  },
})
