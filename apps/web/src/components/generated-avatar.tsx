import { useMemo } from 'react'

import {
  botttsNeutral,
  initials,
  notionistsNeutral,
} from '@dicebear/collection'
import { createAvatar } from '@dicebear/core'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@marv-chat/ui/components/ui/avatar'
import { cn } from '@marv-chat/ui/lib/utils'

interface Props {
  seed: string
  className?: string
  style: 'botttsNeutral' | 'initials' | 'notionistsNeutral'
}

export const GeneratedAvatar = ({ seed, style, className }: Props) => {
  const avatar = useMemo(() => {
    const avatarVariants = {
      botttsNeutral: () => createAvatar(botttsNeutral, { seed }),
      initials: () => createAvatar(initials, { seed }),
      notionistsNeutral: () => createAvatar(notionistsNeutral, { seed }),
    }

    return avatarVariants[style]()
  }, [seed, style])

  const avatarUri = useMemo(() => avatar.toDataUri(), [avatar])

  return (
    <Avatar className={cn('after:border-none', className)}>
      <AvatarImage src={avatarUri} alt={seed} />
      <AvatarFallback className={cn('uppercase', className)}>
        {seed.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
