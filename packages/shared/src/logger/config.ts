import 'dotenv/config'
import pino from 'pino'
import type { LoggerOptions } from 'pino'

const isDev = process.env.NODE_ENV !== 'production'
const isTest = process.env.NODE_ENV === 'test'

export const loggerConfig: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),

  // Disable logging in test environment
  enabled: !isTest,

  // Base configuration
  base: {
    env: process.env.NODE_ENV,
    // Remove default pid and hostname in production for cleaner logs
    ...(isDev && { pid: process.pid }),
  },

  // Timestamp configuration
  timestamp: () => `,"time":"${new Date().toISOString()}"`,

  // Custom serializers for better error logging
  serializers: {
    err: pino.stdSerializers.err,
    req: pino.stdSerializers.req,
    res: pino.stdSerializers.res,
  },

  // Pretty printing for development
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
          ignore: 'pid,hostname',
        },
      }
    : undefined,

  // Redact sensitive information
  redact: {
    paths: [
      'password',
      'token',
      'apiKey',
      'api_key',
      'authorization',
      'cookie',
      'secret',
      '*.password',
      '*.token',
      '*.apiKey',
    ],
    remove: true,
  },
}
