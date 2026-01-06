import { motion } from 'motion/react'

import { Link } from '@tanstack/react-router'
import { MarvIcon } from '@/components/global/marv-icon'
import { cn } from '@/lib/utils'

const MotionLink = motion.create(Link)

export const AppLogo = ({ className }: { className?: string }) => {
  return (
    <MotionLink
      to="/"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      viewTransition={true}
      className="mx-auto flex size-fit items-center justify-center text-lg font-bold"
    >
      <MarvIcon className={cn('h-7 w-auto', className)} />
      Chat
    </MotionLink>
  )
}
