import { auth } from '@/lib/auth/server'

export const createORPCContext = async ({ headers }: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers,
  })

  return {
    auth: session,
  }
}

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>
