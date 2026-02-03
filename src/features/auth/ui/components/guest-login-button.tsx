import { IconUser } from '@tabler/icons-react'
import { useRouter } from '@tanstack/react-router'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { signIn } from '@/lib/auth/client'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

export const GuestLoginButton = () => {
  const [isPendingGuest, startTransitionGuest] = useTransition()

  const router = useRouter()

  const handleGuestLogin = async () => {
    startTransitionGuest(async () => {
      await signIn.anonymous({
        fetchOptions: {
          onSuccess: () => {
            toast.success('Login successful')
            void router.invalidate()
          },
          onError: (ctx) => {
            toast.error('Login failed', {
              description: ctx.error.message,
            })
          },
        },
      })
    })
  }

  return (
    <Button
      type="button"
      variant="default"
      size="lg"
      className="w-full"
      onClick={handleGuestLogin}
      disabled={isPendingGuest}
    >
      {isPendingGuest ? <Spinner /> : <IconUser />} Continue as Guest
    </Button>
  )
}
