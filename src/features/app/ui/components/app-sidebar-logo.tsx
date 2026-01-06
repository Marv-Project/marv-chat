import { motion } from 'motion/react'

import { Link } from '@tanstack/react-router'
import { MarvIcon } from '@/components/global/marv-icon'

const MotionLink = motion.create(Link)

export const AppSidebarLogo = () => {
  return (
    <MotionLink
      to="/"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.9 }}
      viewTransition={true}
      className="mx-auto flex size-fit items-end justify-center text-lg font-bold"
    >
      <MarvIcon className="h-8 w-auto" />
      Chat
    </MotionLink>
  )
}
