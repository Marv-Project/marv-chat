import { SidebarContent } from '@marv-chat/ui/components/ui/sidebar'
import { cn } from '@marv-chat/ui/lib/utils'
import type { ComponentProps } from 'react'

type AppSidebarContentProps = ComponentProps<typeof SidebarContent>

export const AppSidebarContent = ({
  className,
  ...props
}: AppSidebarContentProps) => {
  return (
    <SidebarContent {...props} className={cn('mt-2 px-4', className)}>
      This is the content
    </SidebarContent>
  )
}
