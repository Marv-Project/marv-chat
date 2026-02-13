import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import type { ORPCRouterClient } from '@marv-chat/api/routers'
import { createRouterClient } from '@orpc/server'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { orpcRouter } from '@marv-chat/api/routers'
import { createORPCContext } from '@marv-chat/api/context'

const getORPCClient = createIsomorphicFn()
  .server(async () => {
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
