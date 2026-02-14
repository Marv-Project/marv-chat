import {
  SidebarInset,
  SidebarProvider,
} from '@marv-chat/ui/components/ui/sidebar'
import { AppLeftNavbar, AppRightNavbar } from '@/components/app-navbar'
import { AppSidebar } from '@/components/app-sidebar'

export const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppLeftNavbar />
      <AppRightNavbar />

      <AppSidebar variant="sidebar" />

      <SidebarInset className="relative flex min-h-svh w-full flex-1 flex-col overflow-hidden transition-[width,height]">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
