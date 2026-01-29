import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react'
import { Activity } from 'react'
import { Link } from '@tanstack/react-router'
import { useSidebar } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeModeToggle } from '@/components/global/theme-mode-toggle'

export const ChatHeader = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  const isCollapsedOrMobile = state === 'collapsed' || isMobile

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between p-2">
      <nav className="bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border rounded-md border p-0.5 backdrop-blur-sm transition-all ease-in-out">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
          aria-label={
            isCollapsedOrMobile ? 'Expand sidebar' : 'Collapse sidebar'
          }
        >
          {isCollapsedOrMobile ? <PanelLeftIcon /> : <PanelLeftCloseIcon />}
        </Button>

        <Activity mode={isCollapsedOrMobile ? 'visible' : 'hidden'}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Search"
          >
            <SearchIcon />
            <span className="sr-only">Search Chat</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="New Chat"
            asChild
          >
            <Link to="/" viewTransition>
              <PlusIcon />
              <span className="sr-only">New Chat</span>
            </Link>
          </Button>
        </Activity>
      </nav>

      <nav className="bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border rounded-md border p-0.5 backdrop-blur-sm transition-all ease-in-out">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Settings"
            >
              <SettingsIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-44 p-2"
          >
            <ThemeModeToggle />
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </header>
  )
}
