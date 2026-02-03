import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'
import { getMessages } from '@/orpc/routers/message'
import {
  branchThread,
  deleteThread,
  getThread,
  getThreads,
  renameThread,
  togglePinThread,
} from '@/orpc/routers/thread'

export const orpcRouter = {
  threads: {
    getMany: getThreads,
    getOne: getThread,
    delete: deleteThread,
    rename: renameThread,
    togglePin: togglePinThread,
    branch: branchThread,
  },

  messages: {
    getMany: getMessages,
  },
}

export type ORPCRouterClient = RouterClient<typeof orpcRouter>

export type RouterInputs = InferRouterInputs<typeof orpcRouter>
export type RouterOutputs = InferRouterOutputs<typeof orpcRouter>
