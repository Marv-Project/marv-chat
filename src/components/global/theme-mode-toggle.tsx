import { IconDeviceLaptop, IconMoon, IconSun } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '@/components/providers/theme-provider'

export function ThemeModeToggle() {
  const { setTheme, theme } = useTheme()

  return (
    <div className="flex items-center justify-between">
      <p>Theme</p>

      <div
        role="group"
        aria-label="Theme selection"
        className="bg-background rounded-md border"
      >
        <Button
          type="button"
          variant={theme === 'light' ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={() => setTheme('light')}
          aria-label="Select light theme"
          aria-pressed={theme === 'light'}
        >
          <IconSun />
        </Button>

        <Button
          type="button"
          variant={theme === 'system' ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={() => setTheme('system')}
          aria-label="Select system theme"
          aria-pressed={theme === 'system'}
        >
          <IconDeviceLaptop />
        </Button>

        <Button
          type="button"
          variant={theme === 'dark' ? 'secondary' : 'ghost'}
          size="icon-sm"
          onClick={() => setTheme('dark')}
          aria-label="Select dark theme"
          aria-pressed={theme === 'dark'}
        >
          <IconMoon />
        </Button>
      </div>
    </div>
  )
}
