// type for a simple function that logs it's arguments to the console
type LogFn = (...ags: any[]) => void

export type LogLevel = "debug" | "info" | "warning" | "error" | "none"

export interface LogOptions {
  logFn?: LogFn,
  logLevel: LogLevel,
}

export const isLogOptions = (possibleOptions: any): possibleOptions is LogOptions => {
  return possibleOptions && (possibleOptions as LogOptions).logLevel !== undefined
}

const logLevelToNum = (level: LogLevel): number =>
  level === "debug"   ? 4 :
  level === "info"    ? 3 :
  level === "warning" ? 2 :
  level === "error"   ? 1 :
  level === "none"    ? 0 : -1

// checks if the level of the log about to run (logLevel) is acceptable for the current log level option (optionLevel)
export const isAboveLevel = (optionLevel: LogLevel, logLevel: LogLevel): boolean => 
  logLevelToNum(logLevel) >= logLevelToNum(optionLevel)

// get log level from env
const getLogLevel = () =>
  /debug/i.test(process.env.LOG_LEVEL ?? "") ? "debug"   :
  /info/i .test(process.env.LOG_LEVEL ?? "") ? "info"    :
  /warn/i .test(process.env.LOG_LEVEL ?? "") ? "warning" :
  /error/i.test(process.env.LOG_LEVEL ?? "") ? "error"   :
  /none/i .test(process.env.LOG_LEVEL ?? "") ? "none"    :
  // when in test environment and LOG_LEVEL isn't set, don't log:
  process.env.NODE_ENV === 'test' ? "none" :
  // else, log info, warnings and errors
  "info"

// get default logging options
export const getDefaultOptions = (): LogOptions => ({
  logLevel: getLogLevel(),
})
