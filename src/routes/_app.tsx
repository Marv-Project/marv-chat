import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getAuthFn } from '@/functions/get-auht-fn'

export const Route = createFileRoute('/_app')({
  component: App,
  beforeLoad: async () => {
    const auth = await getAuthFn()
    return { auth }
  },
  loader: ({ context, location }) => {
    if (!context.auth) {
      throw redirect({
        from: '/',
        to: '/login',
        search: { callbackURL: location.href },
        viewTransition: true,
      })
    }
  },
})

function App() {
  return (
    <>
      <Outlet />
    </>
  )
}
