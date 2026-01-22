import type { ReactNode } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const AppTooltip = ({
  children,
  content,
  side,
  sideOffset,
}: {
  side?: 'bottom' | 'top' | 'right' | 'left' | undefined
  sideOffset?: number
  children: ReactNode
  content: string
}) => {
  return (
    <Tooltip delayDuration={1000} disableHoverableContent={true}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side={side}
        sideOffset={sideOffset}
        className="bg-background border-border/75 text-muted-foreground pointer-events-none border"
      >
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  )
}
