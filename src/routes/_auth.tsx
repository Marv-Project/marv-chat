import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { loginRouterValidator } from '@/schemas/router.schema'
import { getAuthFn } from '@/functions/get-auht-fn'

export const Route = createFileRoute('/_auth')({
  component: Auth,
  validateSearch: loginRouterValidator,
  beforeLoad: async ({ search }) => {
    const auth = await getAuthFn()
    return { auth, search }
  },
  loader: ({ context }) => {
    if (context.auth) {
      throw redirect({
        to: context.search.callbackURL,
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
