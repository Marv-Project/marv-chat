import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@marv-chat/ui/components/ui/avatar'
import type { auth } from '@marv-chat/auth/server'
import { GeneratedAvatar } from '@/components/generated-avatar'

export const AvatarUser = ({
  user,
}: {
  user: typeof auth.$Infer.Session.user
}) => {
  if (!user.image) {
    return (
      <GeneratedAvatar
        seed={user.name}
        style="notionistsNeutral"
        className="size-8"
      />
    )
  }

  return (
    <Avatar className="size-8">
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback className="size-8 uppercase">
        {user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
