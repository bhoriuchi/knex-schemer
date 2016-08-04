import { isFunction } from './litedash'
import manakin from 'manakin'
let con = manakin.local

const FATAL = 60
const ERROR = 50
const WARN = 40
const INFO = 30
const DEBUG = 20
const TRACE = 10

let config = {
  logLevel: INFO,
  logger: {
    fatal: (body) => {
      if (config.logLevel && config.logLevel <= FATAL) con.error({ level: FATAL, type: 'FATAL', body })
    },
    error: (body) => {
      if (config.logLevel && config.logLevel <= ERROR) con.error({ level: ERROR, type: 'ERROR', body })
    },
    warn: (body) => {
      if (config.logLevel && config.logLevel <= WARN) con.warn({ level: WARN, type: 'WARN', body })
    },
    info: (body) => {
      if (config.logLevel && config.logLevel <= INFO) con.log({ level: INFO, type: 'INFO', body })
    },
    debug: (body) => {
      if (config.logLevel && config.logLevel <= DEBUG) con.log({ level: DEBUG, type: 'DEBUG', body })
    },
    trace: (body) => {
      if (config.logLevel && config.logLevel <= TRACE) con.log({ level: TRACE, type: 'TRACE', body })
    }
  }
}

export function setLevel (level) {
  if (level >= 0) config.logLevel = level
}

export function setLogger (logger) {
  if (isFunction(logger)) config.logger = logger
}

export const log = {
  fatal: (obj) => config.logger.fatal(obj),
  error: (obj) => config.logger.error(obj),
  warn: (obj) => config.logger.warn(obj),
  info: (obj) => config.logger.info(obj),
  debug: (obj) => config.logger.debug(obj),
  trace: (obj) => config.logger.trace(obj)
}

export default {
  FATAL,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  TRACE,
  setLevel,
  setLogger,
  log
}