import { createRouterClient } from '@orpc/server'
import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { createIsomorphicFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import type { ORPCRouterClient } from '@/orpc/routers'
import { orpcRouter } from '@/orpc/routers'
import { createORPCContext } from '@/orpc/context'

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
