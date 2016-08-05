import { isObject } from './litedash'
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
  if (!isNaN(level) && level >= 0) config.logLevel = level
}

export function setLogger (logger) {
  if (isObject(logger)) config.logger = logger
}

export function configureLogger (config = {}) {
  if (config.level) setLevel(config.level)
  if (config.logger) setLogger(config.logger)
}

export const log = {
  fatal: function () {
    if (config.logger.fatal) config.logger.fatal.apply(this, arguments)
  },
  error: function () {
    if (config.logger.error) config.logger.error.apply(this, arguments)
  },
  warn: function () {
    if (config.logger.warn) config.logger.warn.apply(this, arguments)
  },
  info: function () {
    if (config.logger.info) config.logger.info.apply(this, arguments)
  },
  debug: function () {
    if (config.logger.debug) config.logger.debug.apply(this, arguments)
  },
  trace: function () {
    if (config.logger.trace) config.logger.trace.apply(this, arguments)
  }
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
  configureLogger,
  log
}