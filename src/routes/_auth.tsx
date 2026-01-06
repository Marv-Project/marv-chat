import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { loginRouterValidator } from '@/schemas/router.schema'
import { getAuthFn } from '@/functions/get-auth-fn'
import { validateCallbackUrl } from '@/lib/validate-callback-url'

export const Route = createFileRoute('/_auth')({
  component: Auth,
  validateSearch: loginRouterValidator,
  beforeLoad: async ({ search }) => {
    const auth = await getAuthFn()
    return { auth, search }
  },
  loader: ({ context }) => {
    if (context.auth) {
      const safeCallbackUrl = validateCallbackUrl(context.search.callbackURL)

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
