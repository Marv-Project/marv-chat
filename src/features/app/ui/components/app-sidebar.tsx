import { Sidebar } from '@/components/ui/sidebar'
import { AppSidebarHeader } from '@/features/app/ui/components/app-sidebar-header'
import { AppSidebarFooter } from '@/features/app/ui/components/app-sidebar-footer'
import { AppSidebarContent } from '@/features/app/ui/components/app-sidebar-content'
import { useChats } from '@/hooks/chat/use-chats'

export const AppSidebar = ({
  activeChatId,
  ...props
}: React.ComponentProps<typeof Sidebar> & { activeChatId?: string }) => {
  const chats = useChats()

  return (
    <Sidebar collapsible="offExamples" {...props}>
      <AppSidebarHeader />

      <AppSidebarContent items={chats.data} activeChatId={activeChatId} />

      <AppSidebarFooter />
    </Sidebar>
  )
}
