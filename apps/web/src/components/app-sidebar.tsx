import { Sidebar } from '@marv-chat/ui/components/ui/sidebar'
import { AppSidebarHeader } from '@/components/app-sidebar-header'
import { AppSidebarContent } from '@/components/app-sidebar-content'
import { AppSidebarFooter } from '@/components/app-sidebar-footer'

type AppSidebarProps = React.ComponentProps<typeof Sidebar>

export const AppSidebar = ({ ...props }: AppSidebarProps) => {
  return (
    <Sidebar {...props}>
      <AppSidebarHeader />

      <AppSidebarContent />

      <AppSidebarFooter />
    </Sidebar>
  )
}
