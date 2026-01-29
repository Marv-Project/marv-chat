import { validateCallbackUrl } from '@/lib/validate-callback-url'
import { loginRouterValidator } from '@/schemas/router.schema'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: Auth,
  validateSearch: loginRouterValidator,
  beforeLoad: ({ context, search }) => {
    if (context.auth) {
      const safeCallbackUrl = validateCallbackUrl(search.callbackURL)

      throw redirect({
        to: safeCallbackUrl,
        viewTransition: true,
      })
    }
  },
})

function Auth() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Outlet />
    </div>
  )
}
