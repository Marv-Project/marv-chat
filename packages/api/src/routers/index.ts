import { publicProcedure } from '@marv-chat/api'
import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'

export const orpcRouter = {
  healthCheck: publicProcedure.handler(() => {
    return 'OK'
  }),
}

export type ORPCRouterClient = RouterClient<typeof orpcRouter>

export type ORPCRouterInputs = InferRouterInputs<typeof orpcRouter>
export type ORPCRouterOutputs = InferRouterOutputs<typeof orpcRouter>
