import {
  PanelLeftCloseIcon,
  PanelLeftIcon,
  SearchIcon,
  SettingsIcon,
} from 'lucide-react'
import { Activity } from 'react'
import { ThemeModeToggle } from '@/components/global/theme-mode-toggle'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export const AppHeader = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  return (
    <header className="sticky top-0 z-50 mt-2 flex h-11 w-full items-center justify-between rounded-md">
      <div
        className={cn(
          'bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border rounded-md border p-1 backdrop-blur-sm transition-all ease-in-out',
          (state === 'collapsed' || isMobile) && 'ml-2',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
        >
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon />
          ) : (
            <PanelLeftCloseIcon />
          )}
        </Button>

        <Activity
          mode={state === 'collapsed' || isMobile ? 'visible' : 'hidden'}
        >
          <Button type="button" variant="ghost" size="icon-sm">
            <SearchIcon />
          </Button>
        </Activity>
      </div>

      <div className="bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border mr-2 rounded-md border p-1 backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm">
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
      </div>
    </header>
  )
}

export const AppLeftNavHeader = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()

  return (
    <nav
      className={cn(
        'pointer-events-auto absolute top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 px-4 pt-5 transition-[width,height] ease-linear',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
        isMobile && 'px-2 pt-0',
      )}
    >
      <div
        className={cn(
          'p-1 transition-all ease-in-out',
          (state === 'collapsed' || isMobile) &&
            'bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border rounded-md border backdrop-blur-sm',
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={toggleSidebar}
        >
          {state === 'collapsed' || isMobile ? (
            <PanelLeftIcon />
          ) : (
            <PanelLeftCloseIcon />
          )}
        </Button>

        <Activity
          mode={state === 'collapsed' || isMobile ? 'visible' : 'hidden'}
        >
          <Button type="button" variant="ghost" size="icon-sm">
            <SearchIcon />
          </Button>
        </Activity>
      </div>
    </nav>
  )
}

export const AppRigthtNavHeader = () => {
  const { isMobile } = useSidebar()

  return (
    <nav
      className={cn(
        'pointer-events-auto absolute top-0 right-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 px-4 pt-5 transition-[width,height] ease-linear',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
        isMobile && 'px-2 pt-0',
      )}
    >
      <div className="bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border rounded-md border p-1 backdrop-blur-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon-sm">
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
      </div>
    </nav>
  )
}
