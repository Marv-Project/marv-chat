import { Sidebar } from '@/components/ui/sidebar'
import { AppSidebarHeader } from '@/features/app/ui/components/app-sidebar-header'
import { AppSidebarFooter } from '@/features/app/ui/components/app-sidebar-footer'
import { AppSidebarContent } from '@/features/app/ui/components/app-sidebar-content'

export const AppSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
  return (
    <Sidebar collapsible="offExamples" {...props}>
      <AppSidebarHeader />

      <AppSidebarContent />

      <AppSidebarFooter />
    </Sidebar>
  )
}
