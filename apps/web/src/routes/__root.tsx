import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { LazyMotion, domAnimation } from 'motion/react'

import { TooltipProvider } from '@marv-chat/ui/components/ui/tooltip'
import { Toaster } from '@marv-chat/ui/components/ui/sonner'
import type { orpc } from '@/utils/orpc'
import type { QueryClient } from '@tanstack/react-query'
import appCss from '@/styles.css?url'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { getAuthFn } from '@/functions/get-auth-fn'

interface AppRouterContext {
  orpc: typeof orpc
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<AppRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  beforeLoad: async () => {
    const auth = await getAuthFn()

    return { auth }
  },

  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="selection:bg-primary selection:text-primary-foreground">
        <LazyMotion features={domAnimation}>
          <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <TooltipProvider>{children}</TooltipProvider>
            <Toaster position="top-center" />
          </ThemeProvider>
        </LazyMotion>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            {
              name: 'Tanstack Query',
              render: <ReactQueryDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
