import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/chat')({
  component: () => <Outlet />,
  beforeLoad: ({ location }) => {
    if (location.href === '/chat') {
      throw redirect({
        to: '/',
      })
    }
  },
})
