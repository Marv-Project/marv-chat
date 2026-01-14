import { db } from '@/lib/db'
import { ChatSDKError } from '@/lib/errors'

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
    console.error('Failed to create stream', error)
    throw new ChatSDKError('bad_request:database', 'Failed to create stream')
  }
}
