import { db } from '@marv-chat/db'
import * as schema from '@marv-chat/db/schemas/auth'
import { env } from '@marv-chat/env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { tanstackStartCookies } from 'better-auth/tanstack-start'
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
import { z } from 'zod'
import { generateNanoId } from '@marv-chat/shared'
import { faker } from '@faker-js/faker'

export const auth = betterAuth({
  appName: 'MarvChat',
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
    schema: {
      user: schema.userTable,
      session: schema.sessionTable,
      account: schema.accountTable,
      verification: schema.verificationTable,
      jwks: schema.jwksTable,
    },
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
  secret: env.BETTER_AUTH_SECRET,
  session: {
    expiresIn: 60 * 60 * 24 * 3,
  },
  trustedOrigins: [env.CORS_ORIGIN],
  user: {
    additionalFields: {
      type: {
        type: ['guest', 'registered'] as schema.UserTypeEnum[],
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
