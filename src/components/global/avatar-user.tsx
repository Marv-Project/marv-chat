import type { auth } from '@/lib/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GeneratedAvatar } from '@/components/global/generated-avatar'

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
        className="size-8 rounded-lg"
      />
    )
  }

  return (
    <Avatar className="size-8 rounded-lg">
      <AvatarImage src={user.image} alt={user.name} />
      <AvatarFallback className="size-8 rounded-lg uppercase">
        {user.name.charAt(0)}
      </AvatarFallback>
    </Avatar>
  )
}
