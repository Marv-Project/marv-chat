/**
 * Shared utility functions used across the monorepo.
 *
 * Add pure, reusable utility functions here, for example:
 *
 * export function formatRelativeTime(date: Date): string { ... }
 * export function slugify(text: string): string { ... }
 * export function truncate(text: string, maxLength: number): string { ... }
 */
import { customAlphabet } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'

export * from './validate-callback-url'

export const generateNanoId = (length = 4): string => {
  const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', length)
  return nanoid()
}

export const generateUUID = (): string => {
  return uuidv4()
}
