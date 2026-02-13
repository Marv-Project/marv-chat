import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  component: App,
  beforeLoad: ({ context, location }) => {
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
