// type for a simple function that logs it's arguments to the console
type LogFn = (...ags: any[]) => void

// type LogLevel = "debug" | "info" | "warn" | "error"
export enum LogLevel {
  none = 0,
  error,
  warning,
  info,
  debug,
}

export interface LogOptions {
  logFn?: LogFn,
  logLevel: LogLevel,
}

export const isLogOptions = (possibleOptions: any): possibleOptions is LogOptions => {
  return (possibleOptions as LogOptions).logLevel !== undefined
}

// get log level from env
const getLogLevel = () =>
  /debug/i.test(process.env.LOG_LEVEL ?? "") ? LogLevel.debug   :
  /info/i .test(process.env.LOG_LEVEL ?? "") ? LogLevel.info    :
  /warn/i .test(process.env.LOG_LEVEL ?? "") ? LogLevel.warning :
  /error/i.test(process.env.LOG_LEVEL ?? "") ? LogLevel.error   :
  /none/i .test(process.env.LOG_LEVEL ?? "") ? LogLevel.none    :
  // when in test environment and LOG_LEVEL isn't set, don't log:
  process.env.NODE_ENV === 'test' ? LogLevel.none :
  // else, log info, warnings and errors
  LogLevel.info

// get default logging options
export const getDefaultOptions = (): LogOptions => ({
  logLevel: getLogLevel(),
})
