import { IconMessageChatbot } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'
import {
  FolderIcon,
  MoreHorizontalIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import type { RouterOutputs } from '@/orpc/routers'
import { DeleteChatDialog } from '@/features/app/ui/components/delete-chat-dialog'
import { useGroupedChats } from '@/hooks/chat/use-grouped-chats'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface AppSidebarContentProps {
  items: RouterOutputs['chats']['getAll']
  activeChatId?: string
}

export const AppSidebarContent = ({
  items,
  activeChatId,
}: AppSidebarContentProps) => {
  const { isMobile } = useSidebar()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedChat, setSelectedChat] = useState<{
    id: string
    title: string
  } | null>(null)

  // Group chats by time periods
  const { groupedChats, periodsWithChats } = useGroupedChats(items)

  const handleDeleteClick = (chatId: string, chatTitle: string) => {
    setSelectedChat({ id: chatId, title: chatTitle })
    setDeleteDialogOpen(true)
  }

  // Render a single chat item with all interactions
  const renderChatItem = (item: RouterOutputs['chats']['getAll'][number]) => (
    <SidebarMenuItem key={item.id}>
      <SidebarMenuButton isActive={item.id === activeChatId} asChild>
        <Link to="/chat/$chatId" params={{ chatId: item.id }} viewTransition>
          <IconMessageChatbot />
          <span>{item.title}</span>
        </Link>
      </SidebarMenuButton>

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
        >
          <DropdownMenuItem>
            <FolderIcon />
            <span>Open</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShareIcon />
            <span>Share</span>
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
        <DeleteChatDialog
          chatId={selectedChat.id}
          chatTitle={selectedChat.title}
          isCurrentChat={selectedChat.id === activeChatId}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
        />
      )}

      <SidebarContent className="mt-2">
        {periodsWithChats.map((period) => (
          <SidebarGroup
            key={period}
            className="group-data-[collapsible=icon]:hidden"
          >
            <SidebarGroupLabel>{period}</SidebarGroupLabel>

            <SidebarMenu>
              {groupedChats[period].map(renderChatItem)}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </>
  )
}
