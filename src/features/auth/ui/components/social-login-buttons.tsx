import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import { useTransition } from 'react'
import { toast } from 'sonner'
import { getRouteApi } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { signIn } from '@/lib/auth/client'
import { Spinner } from '@/components/ui/spinner'

const routeApi = getRouteApi('/_auth')

export const SocialLoginButtons = () => {
  const [isPendingGithub, startTransitionGithub] = useTransition()
  const [isPendingGoogle, startTransitionGoogle] = useTransition()

  const { callbackURL } = routeApi.useSearch()

  const handleSocialLoginGithub = async () => {
    startTransitionGithub(async () => {
      await signIn.social({
        provider: 'github',
        callbackURL,
        fetchOptions: {
          onError: (ctx) => {
            toast.error('Login failed', {
              description: ctx.error.message,
            })
          },
        },
      })
    })
  }

  const handleSocialLoginGoogle = async () => {
    startTransitionGoogle(async () => {
      await signIn.social({
        provider: 'google',
        callbackURL,
        fetchOptions: {
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
    <div className="grid gap-4">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleSocialLoginGithub}
        disabled={isPendingGithub}
      >
        {isPendingGithub ? <Spinner /> : <FaGithub />} Continue with GitHub
      </Button>

      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={handleSocialLoginGoogle}
        disabled={isPendingGoogle}
      >
        {isPendingGoogle ? <Spinner /> : <FcGoogle />} Continue with Google
      </Button>
    </div>
  )
}
