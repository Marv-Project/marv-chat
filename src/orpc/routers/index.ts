import type {
  InferRouterInputs,
  InferRouterOutputs,
  RouterClient,
} from '@orpc/server'
import { getAllMessages } from '@/orpc/routers/message'
import { branchChat, deleteChat, getAllChat, renameChat, togglePinChat } from '@/orpc/routers/chat'

export const orpcRouter = {
  chats: {
    getAll: getAllChat,
    delete: deleteChat,
    rename: renameChat,
    togglePin: togglePinChat,
    branch: branchChat,
  },

  messages: {
    getAll: getAllMessages,
  },
}

export type ORPCRouterClient = RouterClient<typeof orpcRouter>

export type RouterInputs = InferRouterInputs<typeof orpcRouter>
export type RouterOutputs = InferRouterOutputs<typeof orpcRouter>
