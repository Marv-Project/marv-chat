import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'
import { getAllMessages } from '@/orpc/routers/message'
import {
  branchThread,
  deleteThread,
  getThreads,
  renameThread,
  togglePinThread,
} from '@/orpc/routers/thread'

export const orpcRouter = {
  threads: {
    getAll: getThreads,
    delete: deleteThread,
    rename: renameThread,
    togglePin: togglePinThread,
    branch: branchThread,
  },

  messages: {
    getAll: getAllMessages,
  },
}

export type ORPCRouterClient = RouterClient<typeof orpcRouter>

export type RouterInputs = InferRouterInputs<typeof orpcRouter>
export type RouterOutputs = InferRouterOutputs<typeof orpcRouter>
