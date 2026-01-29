import { db } from '@/lib/db'
import { auth } from '@/lib/auth'

export const createORPCContext = async (opts: { headers: Headers }) => {
  const session = await auth.api.getSession({
    headers: opts.headers,
  })

  return {
    ...opts,
    db,
    auth: session,
  }
}

export type ORPCContext = Awaited<ReturnType<typeof createORPCContext>>
