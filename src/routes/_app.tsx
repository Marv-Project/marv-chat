import {
  Outlet,
  createFileRoute,
  redirect,
  useParams,
} from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
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
    <SidebarProvider>
      <AppSidebar variant="inset" activeChatId={chatId} />

      <SidebarInset className="relative flex min-h-[calc(100svh-1rem)] w-full flex-1 flex-col overflow-hidden transition-[width,height]">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
