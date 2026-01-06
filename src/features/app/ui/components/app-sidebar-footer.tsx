import {
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
} from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { ChevronsUpDown, LogOutIcon } from 'lucide-react'
import type { auth } from '@/lib/auth'
import { AvatarUser } from '@/components/global/avatar-user'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { authClient } from '@/lib/auth/client'

export const AppSidebarFooter = () => {
  const router = useRouter()

  const { data: auth, isPending } = authClient.useSession()

  const { isMobile } = useSidebar()

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          void router.invalidate()
        },
      },
    })
  }

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          {!auth || isPending ? (
            <Skeleton className="h-12 w-full" />
          ) : (
            <AppSidebarUserButton
              user={auth.user}
              onSignOut={handleSignOut}
              isMobile={isMobile}
            />
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

export const AppSidebarUserButton = ({
  user,
  onSignOut,
  isMobile,
}: {
  user: typeof auth.$Infer.Session.user
  onSignOut: () => void
  isMobile: boolean
}) => {
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
          >
            <AvatarUser user={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </SidebarMenuButton>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="font-normal">
            <div className="flex items-center gap-2 text-left text-sm">
              <AvatarUser user={user} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <DrawerTitle className="truncate font-semibold">
                  {user.name}
                </DrawerTitle>
                <DrawerDescription className="truncate text-xs">
                  {user.email}
                </DrawerDescription>
              </div>
            </div>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" className="w-full">
                <IconCreditCard />
                Billing
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button variant="default" onClick={onSignOut} className="w-full">
                <LogOutIcon />
                Sign out
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <AvatarUser user={user} />
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              {user.email}
            </span>
          </div>
          <IconDotsVertical className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={'right'}
        align="end"
        sideOffset={14}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <AvatarUser user={user} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconCreditCard />
            Billing
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <IconLogout />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
