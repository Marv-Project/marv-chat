import { InferEnum, relations } from 'drizzle-orm'
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { v4 as uuidv4 } from 'uuid'

export const userRoleEnum = pgEnum('user_role', ['user', 'admin'])
export const userTypeEnum = pgEnum('user_type', ['guest', 'registered'])

export const userTable = pgTable('user', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  username: text('username').unique(),
  displayUsername: text('display_username'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  role: userRoleEnum('role').default('user'),
  isAnonymous: boolean('is_anonymous').default(false),
  type: userTypeEnum('type').default('guest'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .$onUpdate(() => new Date())
    .notNull(),
})

export const sessionTable = pgTable(
  'session',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv4()),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    impersonatedBy: text('impersonated_by'),
  },
  (table) => [index('session_userId_idx').on(table.userId)],
)

export const accountTable = pgTable(
  'account',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv4()),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => userTable.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at'),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('account_userId_idx').on(table.userId)],
)

export const verificationTable = pgTable(
  'verification',
  {
    id: text('id')
      .primaryKey()
      .notNull()
      .$defaultFn(() => uuidv4()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at')
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index('verification_identifier_idx').on(table.identifier)],
)

export const jwks = pgTable('jwks', {
  id: text('id')
    .primaryKey()
    .notNull()
    .$defaultFn(() => uuidv4()),
  publicKey: text('public_key').notNull(),
  privateKey: text('private_key').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at'),
})

export const userRelations = relations(userTable, ({ many }) => ({
  sessions: many(sessionTable),
  accounts: many(accountTable),
}))

export const sessionRelations = relations(sessionTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionTable.userId],
    references: [userTable.id],
  }),
}))

export const accountRelations = relations(accountTable, ({ one }) => ({
  user: one(userTable, {
    fields: [accountTable.userId],
    references: [userTable.id],
  }),
}))

export type UserRoleEnum = InferEnum<typeof userRoleEnum>
export type UserTypeEnum = InferEnum<typeof userTypeEnum>
