import { createFileRoute } from '@tanstack/react-router'
import { AppLogo } from '@/components/global/app-logo'
import { Card, CardContent } from '@/components/ui/card'
import { SocialLoginButtons } from '@/features/auth/ui/components/social-login-buttons'

export const Route = createFileRoute('/_auth/login')({
  component: Login,
})

function Login() {
  return (
    <div className="w-full space-y-6">
      <div className="mx-auto space-y-2 text-center">
        <AppLogo className="h-10" />
        <p className="text-muted-foreground text-base font-normal">
          Login to MarvChat to continue
        </p>
      </div>

      <Card className="mx-auto max-w-sm">
        <CardContent>
          <SocialLoginButtons />
        </CardContent>
      </Card>
    </div>
  )
}
