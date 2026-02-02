import { customAlphabet } from 'nanoid'

export const generateNanoId = (length = 4): string => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', length)
  return nanoid()
}
