import { createRouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import type { ORPCRouterClient } from '@marv-chat/api/routers'
import { orpcRouter } from '@marv-chat/api/routers'
import { createORPCContext } from '@marv-chat/api/context'

const getORPCClient = createIsomorphicFn()
  .server(() =>
    createRouterClient(orpcRouter, {
      context: async () => {
        return createORPCContext({ headers: getRequestHeaders() })
      },
    }),
  )
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

export const client: ORPCRouterClient = getORPCClient()
export const orpc = createTanstackQueryUtils(client)
