// type for a simple function that logs it's arguments to the console
type LogFn = (...ags: any[]) => void

export type LogLevel = "debug" | "info" | "warning" | "error" | "none"

export interface LogOptions {
  logFn?: LogFn,
  logLevel: LogLevel,
  logInTests?: boolean,
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
export const isAboveLevel = (optionLevel: LogLevel, { logLevel, logInTests }: LogOptions): boolean => 
  // if in test env and not logging tests don't log
  /test/i.test(process.env.NODE_ENV) && !logInTests ? false:
  logLevelToNum(logLevel) >= logLevelToNum(optionLevel)

// get log level from env
const getLogLevel = () =>
  /debug/i.test(process.env.LOG_LEVEL ?? "") ? "debug"   :
  /info/i .test(process.env.LOG_LEVEL ?? "") ? "info"    :
  /warn/i .test(process.env.LOG_LEVEL ?? "") ? "warning" :
  /error/i.test(process.env.LOG_LEVEL ?? "") ? "error"   :
  /none/i .test(process.env.LOG_LEVEL ?? "") ? "none"    :
  // else, log info, warnings and errors
  "info"

// get default logging options
export const getDefaultOptions = (): LogOptions => ({
  logLevel: getLogLevel(),
  logInTests: /true/i.test(process.env.LOG_TESTS ?? ""),
})
