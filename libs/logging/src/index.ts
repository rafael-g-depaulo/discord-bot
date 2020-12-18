// utility functions using chalk to log stuff to the console
import chalk from "chalk"

// type for a simple function that logs it's arguments to the console
type LogFn = (...ags: any[]) => void

// setup functios to log stuff to terminal
const logDebug: LogFn = console.debug
const logInfo: LogFn  = console.info
const logWarn: LogFn  = console.log
const logErr: LogFn   = console.warn

// type LogLevel = "debug" | "info" | "warn" | "error"
export enum LogLevel {
  none = 0,
  error,
  warning,
  info,
  debug,
}
interface LogOptions {
  logFn?: LogFn,
  logLevel: LogLevel,
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

const defaultOptions: LogOptions = {
  logLevel: getLogLevel(),
}

// debug log
export const debug = (str: string, { logLevel, logFn = logDebug }: LogOptions = defaultOptions) => logLevel >= LogLevel.debug && logFn(
  `[${chalk.greenBright(`DEBUG`)}] ${str}`
)

// info log
export const info = (str: string, { logLevel, logFn = logInfo }: LogOptions = defaultOptions) => logLevel >= LogLevel.info && logFn(
  `[${chalk.blueBright(`INFO`)}] ${str}`
)

// warn log
export const warn = (str: string, { logLevel, logFn = logWarn }: LogOptions = defaultOptions) => logLevel >= LogLevel.warning && logFn(
  `[${chalk.yellowBright(`WARN`)}] ${str}`
)

// error log
export const error = (str: string, { logLevel, logFn = logErr }: LogOptions = defaultOptions) => logLevel >= LogLevel.error && logFn(
  `${chalk.red.bold.bgYellow(`[ERROR]`)} ${chalk.bold.redBright(str)}`
)

// function that handles data/options and sends it to a LogFn so it may send it to the terminal
export type LogFunction = (str: string, opt?: LogOptions) => void
export interface Logger {
  debug: LogFunction,
  error: LogFunction,
  info: LogFunction,
  log: LogFunction,
  warn: LogFunction,
}

export const createLogger = (options: Partial<LogOptions>) => {
  const logOptions = { ...defaultOptions, ...options }
  const logger: Logger = {
    debug: (str, opt) => debug(str, {...logOptions, ...opt }),
    error: (str, opt) => error(str, {...logOptions, ...opt }),
    info:  (str, opt) => info (str, {...logOptions, ...opt }),
    log:   (str, opt) => info (str, {...logOptions, ...opt }),
    warn:  (str, opt) => warn (str, {...logOptions, ...opt }),
  }

  return logger
}

export default {
  debug,
  error,
  info,
  log: info,
  warn,
}
