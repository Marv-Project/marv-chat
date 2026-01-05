import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { AppQueryProvider } from '@/components/providers/app-query-provider'
import { getQueryClient } from '@/lib/query-client'
import { orpc } from '@/orpc/client'
// Import the generated route tree
import { routeTree } from '@/routeTree.gen'

// Create a new router instance
export const getRouter = () => {
  const queryClient = getQueryClient()

  const router = createRouter({
    routeTree,
    context: { queryClient, orpc },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    Wrap: (props: { children: React.ReactNode }) => {
      return (
        <AppQueryProvider queryClient={queryClient}>
          {props.children}
        </AppQueryProvider>
      )
    },
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
