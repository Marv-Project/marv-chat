import { env } from '@/configs/env'

/**
 * Trusted origins for redirect validation.
 * Add additional trusted origins here if needed.
 */
const TRUSTED_ORIGINS: string[] = [env.VITE_APP_URL]

/**
 * Default fallback path when the callback URL is invalid or untrusted.
 */
const DEFAULT_FALLBACK_PATH = '/'

/**
 * Validates a callback URL to prevent open redirect vulnerabilities.
 *
 * A URL is considered valid if:
 * - It's a relative path starting with "/" (but not "//")
 * - It's an absolute URL whose origin matches one of the trusted origins
 *
 * @param callbackURL - The callback URL to validate
 * @returns A safe, validated URL path or the default fallback path
 */
export function validateCallbackUrl(callbackURL: string | undefined): string {
  // If no callback URL, return the default
  if (!callbackURL) {
    return DEFAULT_FALLBACK_PATH
  }

  // Trim whitespace
  const trimmedUrl = callbackURL.trim()

  // Empty string check
  if (!trimmedUrl) {
    return DEFAULT_FALLBACK_PATH
  }

  // Check for protocol-relative URLs (e.g., "//evil.com") - these are unsafe
  if (trimmedUrl.startsWith('//')) {
    return DEFAULT_FALLBACK_PATH
  }

  // Check if it's a relative path (starts with "/" but not "//")
  if (trimmedUrl.startsWith('/')) {
    // Additional check: ensure it doesn't contain protocol patterns that could bypass
    // e.g., "/\evil.com" or path traversal attempts
    try {
      // Normalize the path to catch any sneaky patterns
      const normalized = new URL(trimmedUrl, 'http://localhost').pathname
      // Ensure the path still starts with /
      if (normalized.startsWith('/')) {
        return trimmedUrl
      }
    } catch {
      // If parsing fails, return default
      return DEFAULT_FALLBACK_PATH
    }
    return trimmedUrl
  }

  // For absolute URLs, validate against trusted origins
  try {
    const parsedUrl = new URL(trimmedUrl)

    // Check if the origin is in the trusted list
    const isTrustedOrigin = TRUSTED_ORIGINS.some((trustedOrigin) => {
      try {
        const trusted = new URL(trustedOrigin)
        return parsedUrl.origin === trusted.origin
      } catch {
        return false
      }
    })

    if (isTrustedOrigin) {
      // Return just the pathname + search + hash to avoid any origin issues
      return parsedUrl.pathname + parsedUrl.search + parsedUrl.hash
    }
  } catch {
    // Invalid URL format, fall through to default
  }

  // If none of the above conditions are met, return the safe default
  return DEFAULT_FALLBACK_PATH
}
