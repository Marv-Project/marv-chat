import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import type { ORPCRouterClient } from '@marv-chat/api/routers'

const getORPCClient = createIsomorphicFn()
  .server(async () => {
    const [
      { createRouterClient },
      { getRequestHeaders },
      { orpcRouter },
      { createORPCContext },
    ] = await Promise.all([
      import('@orpc/server'),
      import('@tanstack/react-start/server'),
      import('@marv-chat/api/routers'),
      import('@marv-chat/api/context'),
    ])

    return createRouterClient(orpcRouter, {
      context: async () => {
        return createORPCContext({ headers: getRequestHeaders() })
      },
    })
  })
  .client((): ORPCRouterClient => {
    const link = new RPCLink({
      url: `${window.location.origin}/api/orpc`,
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: 'include',
        })
      },
    })

    return createORPCClient(link)
  })

export const client: ORPCRouterClient = getORPCClient() as ORPCRouterClient
export const orpc = createTanstackQueryUtils(client)
