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

/**
 * Reusable sidebar toggle button that handles the expand/collapse logic
 */
const SidebarToggleButton = () => {
  const { state, toggleSidebar, isMobile } = useSidebar()
  const isCollapsedOrMobile = state === 'collapsed' || isMobile

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-sm"
      onClick={toggleSidebar}
      aria-label={isCollapsedOrMobile ? 'Expand sidebar' : 'Collapse sidebar'}
    >
      {isCollapsedOrMobile ? <PanelLeftIcon /> : <PanelLeftCloseIcon />}
    </Button>
  )
}

/**
 * Reusable search button that appears when sidebar is collapsed/mobile
 */
const SearchButton = () => {
  const { state, isMobile } = useSidebar()
  const isCollapsedOrMobile = state === 'collapsed' || isMobile

  return (
    <Activity mode={isCollapsedOrMobile ? 'visible' : 'hidden'}>
      <Button type="button" variant="ghost" size="icon-sm" aria-label="Search">
        <SearchIcon />
      </Button>
    </Activity>
  )
}

/**
 * Reusable header section wrapper with backdrop blur styling
 */
const HeaderSection = ({
  children,
  className,
  applyMarginOnCollapsed = false,
  applyBackdropOnlyWhenCollapsed = false,
}: {
  children: React.ReactNode
  className?: string
  applyMarginOnCollapsed?: boolean
  applyBackdropOnlyWhenCollapsed?: boolean
}) => {
  const { state, isMobile } = useSidebar()
  const isCollapsedOrMobile = state === 'collapsed' || isMobile

  const baseStyles = 'p-0.5 transition-all ease-in-out'
  const backdropStyles =
    'bg-sidebar/65 supports-backdrop-filter:bg-sidebar/65 border-sidebar-border rounded-md border backdrop-blur-sm max-md:mt-2'

  return (
    <div
      className={cn(
        baseStyles,
        applyBackdropOnlyWhenCollapsed
          ? isCollapsedOrMobile && backdropStyles
          : backdropStyles,
        applyMarginOnCollapsed && isCollapsedOrMobile && 'ml-2',
        className,
      )}
    >
      {children}
    </div>
  )
}

/**
 * Settings dropdown menu with theme toggle
 */
const SettingsDropdown = () => {
  return (
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
  )
}

export const AppLeftNavHeader = () => {
  const { isMobile } = useSidebar()

  return (
    <nav
      className={cn(
        'pointer-events-auto absolute top-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 px-4 pt-5 transition-[width,height] ease-linear',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
        isMobile && 'px-2 pt-0',
      )}
    >
      <HeaderSection applyBackdropOnlyWhenCollapsed>
        <SidebarToggleButton />
        <SearchButton />
      </HeaderSection>
    </nav>
  )
}

export const AppRightNavHeader = () => {
  const { isMobile } = useSidebar()

  return (
    <nav
      className={cn(
        'pointer-events-auto absolute top-0 right-0 z-50 flex h-(--header-height) shrink-0 items-center gap-2 px-4 pt-5 transition-[width,height] ease-linear',
        'group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
        isMobile && 'px-2 pt-0',
      )}
    >
      <HeaderSection>
        <SettingsDropdown />
      </HeaderSection>
    </nav>
  )
}
