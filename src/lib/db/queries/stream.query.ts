import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'
import { logger } from '@/lib/logger'

export const createStreamId = async ({
  chatId,
  streamId,
}: {
  streamId: string
  chatId: string
}) => {
  try {
    const stream = await db.stream.create({
      data: {
        id: streamId,
        chatId,
      },
    })

    return stream
  } catch (error) {
    logger.error({ err: error }, 'Failed to create stream')
    throw new ChatSDKError('bad_request:database', 'Failed to create stream')
  }
}
