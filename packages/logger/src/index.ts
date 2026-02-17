import pino from 'pino'
import { loggerConfig } from './config'
import type { Logger } from 'pino'

export const baseLogger = pino(loggerConfig) as Logger
