import {
  Outlet,
  createFileRoute,
  redirect,
  useParams,
} from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppHeader } from '@/features/app/ui/components/app-header'
import { AppSidebar } from '@/features/app/ui/components/app-sidebar'
import { getAuthFn } from '@/functions/get-auth-fn'

export const Route = createFileRoute('/_app')({
  component: App,
  beforeLoad: async () => {
    const auth = await getAuthFn()
    return { auth }
  },
  loader: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({
        from: '/',
        to: '/login',
        search: { callbackURL: location.href },
        viewTransition: true,
      })
    }
  },
})

function App() {
  const params = useParams({ strict: false })
  const chatId = params.chatId

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="floating" activeChatId={chatId} />
      <SidebarInset>
        <AppHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
