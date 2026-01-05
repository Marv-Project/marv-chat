import { createAuthClient } from 'better-auth/react'
import {
  adminClient,
  anonymousClient,
  inferAdditionalFields,
  multiSessionClient,
  usernameClient,
} from 'better-auth/client/plugins'
import type { auth } from '@/lib/auth'
import { env } from '@/configs/env'

export const authClient = createAuthClient({
  baseURL: env.VITE_APP_URL,
  plugins: [
    adminClient(),
    anonymousClient(),
    multiSessionClient(),
    usernameClient(),
    inferAdditionalFields<typeof auth>(),
  ],
})

export const { signIn, signOut, signUp, useSession } = authClient
