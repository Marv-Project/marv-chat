import {
  Outlet,
  createFileRoute,
  redirect,
  useParams,
} from '@tanstack/react-router'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import {
  AppLeftNavHeader,
  AppRightNavHeader,
} from '@/features/app/ui/components/app-header'
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
    <div className="h-svh w-full overflow-hidden">
      <SidebarProvider>
        <AppLeftNavHeader />
        <AppRightNavHeader />

        <AppSidebar activeChatId={chatId} />

        <SidebarInset>
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
