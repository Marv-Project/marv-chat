import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'
import { publicProcedure } from '@/orpc'

export const orpcRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK'
  }),
}

export type ORPCRouterClient = RouterClient<typeof orpcRouter>

export type RouterInputs = InferRouterInputs<typeof orpcRouter>
export type RouterOutputs = InferRouterOutputs<typeof orpcRouter>
