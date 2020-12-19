import { debugLog, errorLog, infoLog, warnLog } from "./logFunctions"
import { getDefaultOptions, LogOptions } from "./logOptions"
import { LogFunction, runLog } from "./runLog"

export interface Logger {
  debug: LogFunction,
  error: LogFunction,
  info: LogFunction,
  log: LogFunction,
  warn: LogFunction,
}

export const createLogger = (options: Partial<LogOptions> = {}) => {
  const logOptions = { ...getDefaultOptions(), ...options }
  const logger: Logger = {
    debug: runLog(debugLog, logOptions),
    error: runLog(errorLog, logOptions),
    info:  runLog(infoLog, logOptions),
    log:   runLog(infoLog, logOptions),
    warn:  runLog(warnLog, logOptions),
  }

  return logger
}

export default createLogger
