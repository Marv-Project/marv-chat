import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'

const loginRouterSchema = z.object({
  callbackURL: z.string().default('/'),
})

export const loginRouterValidator = zodValidator(loginRouterSchema)
