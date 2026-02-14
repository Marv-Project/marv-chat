import { Button } from '@marv-chat/ui/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@marv-chat/ui/components/ui/dropdown-menu'
import { useSidebar } from '@marv-chat/ui/components/ui/sidebar'
import { cn } from '@marv-chat/ui/lib/utils'
import { Link } from '@tanstack/react-router'
import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react'
import { Activity } from 'react'
import { ThemeModeToggle } from '@/components/theme-mode-toggle'

export const AppLeftNavbar = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  const isCollapsedOrMobile = state === 'collapsed' || isMobile

  return (
    <nav
      className={cn(
        'absolute top-2 left-2 z-50 p-0.5 transition-all duration-300 ease-in-out',
        isCollapsedOrMobile &&
          'bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 rounded-md backdrop-blur-sm',
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        aria-label={isCollapsedOrMobile ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsedOrMobile ? <PanelLeftIcon /> : <PanelLeftCloseIcon />}
      </Button>

      <Activity mode={isCollapsedOrMobile ? 'visible' : 'hidden'}>
        <Button type="button" variant="ghost" size="icon" aria-label="Search">
          <SearchIcon />
          <span className="sr-only">Search Threads</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="New Thread"
          asChild
        >
          <Link to="/" viewTransition>
            <PlusIcon />
            <span className="sr-only">New Thread</span>
          </Link>
        </Button>
      </Activity>
    </nav>
  )
}

export const AppRightNavbar = () => {
  return (
    <nav
      className={cn(
        'absolute top-2 right-2 z-50 p-0.5 transition-all duration-300 ease-in-out',
        'bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 rounded-md backdrop-blur-sm',
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
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
  )
}
