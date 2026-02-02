import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import {
  admin as adminPlugin,
  anonymous as anonymousPlugin,
  bearer as bearerPlugin,
  createAuthMiddleware,
  jwt as jwtPlugin,
  multiSession as multiSessionPlugin,
  openAPI as openAPIPlugin,
  username as usernamePlugin,
} from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
import { faker } from '@faker-js/faker'
import { z } from 'zod'
import { env } from '@/lib/env/server'
import * as schema from '@/lib/db/schemas/auth'
import { db } from '@/lib/db'
import { generateNanoId } from '@/lib/nanoid'

export const auth = betterAuth({
  appName: env.APP_NAME,
  baseURL: env.BETTER_AUTH_URL,
  advanced: {
    database: {
      generateId: false,
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['github', 'google'],
    },
    encryptOAuthTokens: true,
  },
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  emailAndPassword: {
    enabled: false,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Only modify body for sign-in paths
      if (!ctx.path.startsWith('/sign-in')) {
        return { context: ctx }
      }

      if (ctx.path === '/sign-in/anonymous') {
        return {
          context: {
            ...ctx,
            body: {
              ...(ctx.body ?? {}),
              type: 'guest' as schema.UserTypeEnum,
            },
          },
        }
      }

      return {
        context: {
          ...ctx,
          body: {
            ...(ctx.body ?? {}),
            type: 'registered' as schema.UserTypeEnum,
          },
        },
      }
    }),
  },
  plugins: [
    adminPlugin(),
    anonymousPlugin({
      emailDomainName: '@marv.chat',
      generateName: () => faker.person.fullName(),
      generateRandomEmail: () => {
        const id = generateNanoId()
        return `guest-${id}@marv.chat`
      },
    }),
    bearerPlugin(),
    jwtPlugin(),
    multiSessionPlugin(),
    openAPIPlugin(),
    usernamePlugin(),
    tanstackStartCookies(),
  ],
  socialProviders: {
    github: {
      enabled: true,
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      enabled: true,
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  secret: env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 3,
  },
  trustedOrigins: [env.BETTER_AUTH_URL],
  user: {
    additionalFields: {
      type: {
        type: 'string',
        required: true,
        defaultValue: 'guest',
        input: false,
        validator: {
          input: z.enum(['guest', 'registered']),
        },
      },
    },
  },
})
