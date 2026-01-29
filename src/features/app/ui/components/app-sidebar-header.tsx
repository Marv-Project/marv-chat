import { Link } from '@tanstack/react-router'
import { IconSearch } from '@tabler/icons-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { AppSidebarLogo } from '@/features/app/ui/components/app-sidebar-logo'
import { Label } from '@/components/ui/label'

export const AppSidebarHeader = () => {
  return (
    <SidebarHeader className="mt-1">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            className="mx-auto w-full data-[slot=sidebar-menu-button]:p-1.5!"
          >
            <AppSidebarLogo />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      <SidebarGroup className="px-0">
        <SidebarGroupContent className="flex flex-col gap-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Quick Create"
                className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 items-center justify-center duration-200 ease-linear"
                asChild
              >
                <Link to="/" viewTransition>
                  <span className="font-medium">New Chat</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <form>
        <SidebarGroup className="px-0 py-0">
          <SidebarGroupContent className="relative">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              placeholder="Search your chats..."
              className="pl-8"
            />
            <IconSearch className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>
      </form>
    </SidebarHeader>
  )
}
