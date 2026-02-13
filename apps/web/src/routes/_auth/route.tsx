import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { validateCallbackUrl } from '@marv-chat/shared'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'

const loginRouterSchema = z.object({
  callbackURL: z.string().default('/'),
})

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  validateSearch: zodValidator(loginRouterSchema),
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

function RouteComponent() {
  return (
    <div className="flex h-svh items-center justify-center">
      <Outlet />
    </div>
  )
}
