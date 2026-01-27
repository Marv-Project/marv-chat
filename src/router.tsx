import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

import { AppQueryProvider } from '@/components/providers/app-query-provider'
import { getQueryClient } from '@/lib/query-client'
import { orpc } from '@/orpc/client'
// Import the generated route tree
import { routeTree } from '@/routeTree.gen'
import { NotFoundComponent } from './components/global/not-found-component'
import { ErrorComponent } from './components/global/error-component'

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
    defaultPendingComponent: () => <div>Loading...</div>,
    defaultNotFoundComponent: NotFoundComponent,
    defaultErrorComponent: (error) => <ErrorComponent {...error} />,
  })

  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
