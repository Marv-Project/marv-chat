import { Link } from '@tanstack/react-router'
import {
  ChevronRightIcon,
  GitBranchIcon,
  MoreHorizontalIcon,
  PencilIcon,
  PinIcon,
  PinOffIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import type { RouterOutputs } from '@/orpc/routers'
import { AppTooltip } from '@/components/global/app-tooltip'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { DeleteChatDialog } from '@/features/app/ui/components/delete-chat-dialog'
import { RenameChatDialog } from '@/features/app/ui/components/rename-chat-dialog'
import { useGroupedThreads } from '@/hooks/thread/use-grouped-thread'
import { useTogglePinThread } from '@/hooks/thread/use-toggle-pin-thread'

interface AppSidebarContentProps {
  items: RouterOutputs['threads']['getMany']
  activeChatId?: string
}

export const AppSidebarContent = ({
  items,
  activeChatId,
}: AppSidebarContentProps) => {
  const { isMobile } = useSidebar()
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<{
    id: string
    title: string
  } | null>(null)

  const { mutate: togglePin } = useTogglePinThread()

  // Separate pinned and non-pinned chats
  const pinnedThreads = items.filter((item) => item.isPinned)
  const unpinnedThreads = items.filter((item) => !item.isPinned)

  // Group only non-pinned chats by time periods
  const { groupedThreads, periodsWithThreads } =
    useGroupedThreads(unpinnedThreads)

  const handleRenameClick = (threadId: string, threadTitle: string) => {
    setSelectedChat({ id: threadId, title: threadTitle })
    setRenameDialogOpen(true)
  }

  const handleDeleteClick = (threadId: string, threadTitle: string) => {
    setSelectedChat({ id: threadId, title: threadTitle })
    setDeleteDialogOpen(true)
  }

  // Render a single chat item with all interactions
  const renderChatItem = (
    item: RouterOutputs['threads']['getMany'][number],
  ) => (
    <SidebarMenuItem key={item.id}>
      <AppTooltip content={item.title} side="bottom">
        <SidebarMenuButton isActive={item.id === activeChatId} asChild>
          <Link
            to="/chat/$chatId"
            params={{ chatId: item.id }}
            viewTransition
            className="pl-4 text-sm"
          >
            {item.branchedFromThreadId && (
              <GitBranchIcon className="text-muted-foreground size-3 shrink-0" />
            )}
            <span>{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </AppTooltip>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction
            showOnHover
            className="data-[state=open]:bg-accent rounded-sm"
          >
            <MoreHorizontalIcon />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-24 rounded-lg"
          side={isMobile ? 'bottom' : 'right'}
          align={isMobile ? 'end' : 'start'}
          sideOffset={isMobile ? 10 : 20}
        >
          <DropdownMenuItem onClick={() => togglePin({ threadId: item.id })}>
            {item.isPinned ? <PinOffIcon /> : <PinIcon />}
            <span>{item.isPinned ? 'Unpin' : 'Pin'}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleRenameClick(item.id, item.title)}
          >
            <PencilIcon />
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => handleDeleteClick(item.id, item.title)}
          >
            <Trash2Icon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )

  return (
    <>
      {selectedChat && (
        <RenameChatDialog
          chatId={selectedChat.id}
          chatTitle={selectedChat.title}
          open={renameDialogOpen}
          onOpenChange={setRenameDialogOpen}
        />
      )}

      {selectedChat && (
        <DeleteChatDialog
          chatId={selectedChat.id}
          chatTitle={selectedChat.title}
          isCurrentChat={selectedChat.id === activeChatId}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}

      <SidebarContent className="mt-2">
        {pinnedThreads.length > 0 && (
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup className="py-0 group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel asChild>
                <CollapsibleTrigger className="flex w-full items-center">
                  <PinIcon className="mr-1 size-3" />
                  Pinned
                  <ChevronRightIcon className="ml-auto size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
              </SidebarGroupLabel>

              <CollapsibleContent>
                <SidebarMenu>{pinnedThreads.map(renderChatItem)}</SidebarMenu>
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible>
        )}

        {periodsWithThreads.map((period) => (
          <SidebarGroup
            key={period}
            className="py-0 group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroupLabel>{period}</SidebarGroupLabel>

            <SidebarMenu>
              {groupedThreads[period].map(renderChatItem)}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </>
  )
}
