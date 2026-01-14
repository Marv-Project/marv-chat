import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'

const loginRouterSchema = z.object({
  callbackURL: z.string().default('/'),
})

const chatIdRouterSchema = z.object({
  query: z.string().optional(),
})

export const loginRouterValidator = zodValidator(loginRouterSchema)
export const chatIdRouterValidator = zodValidator(chatIdRouterSchema)
