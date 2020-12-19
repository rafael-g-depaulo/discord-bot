// utility functions using chalk to log stuff to the console
import chalk from "chalk"
import { inspect } from "util"

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
const isLogOptions = (possibleOptions: any): possibleOptions is LogOptions => {
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

const defaultOptions: LogOptions = {
  logLevel: getLogLevel(),
}

// function to differenciate on log calls using options object or not
const runLog = (lfn: LogFunctionWithOptions, options: LogOptions): LogFunction => (possibleOptionsOverride: LogOptions | any, ...args: any[]) => {
  // start with default options, and use givenOptions when given
  // const options = { ...defaultOptions, ...givenOpts }

  if (isLogOptions(possibleOptionsOverride)) {
    // log the rest of the args, using options override
    return lfn({ ...options, ...possibleOptionsOverride }, ...args)
  }
  
  // just log, with current options
  return lfn(options, possibleOptionsOverride, ...args)
}

const processValueIntoString = (value: any): string => inspect(value, { colors: true })

const processArgsIntoString = (args: any[]): string => args.map(processValueIntoString).join(" ")

// debug log
const debugLog: LogFunctionWithOptions = ({ logLevel, logFn = console.debug }: LogOptions, ...args: any[]) => logLevel >= LogLevel.debug && logFn(
  `[${chalk.greenBright(`DEBUG`)}] ${processArgsIntoString(args)}`
)
export const debug = runLog(debugLog, defaultOptions)

// info log
const infoLog: LogFunctionWithOptions = ({ logLevel, logFn = console.info }: LogOptions, ...args: any[]) => logLevel >= LogLevel.info && logFn(
  `[${chalk.blueBright(`INFO`)}] ${processArgsIntoString(args)}`
)
export const info = runLog(infoLog, defaultOptions)

// warn log
const warnLog: LogFunctionWithOptions = ({ logLevel, logFn = console.warn }: LogOptions, ...args: any[]) => logLevel >= LogLevel.warning && logFn(
  `[${chalk.yellowBright(`WARN`)}] ${processArgsIntoString(args)}`
)
export const warn = runLog(warnLog, defaultOptions)

// error log
const errorLog: LogFunctionWithOptions = ({ logLevel, logFn = console.error }: LogOptions, ...args: any[]) => logLevel >= LogLevel.error && logFn(
  // TODO: change how the bold.redbright is used here to only apply to string, and leave the rest
  `${chalk.red.bold.bgYellow(`[ERROR]`)} ${chalk.bold.redBright(processArgsIntoString(args))}`
)
export const error = runLog(errorLog, defaultOptions)

// function that handles data/options and sends it to a LogFn so it may send it to the terminal
export type LogFunctionWithoutOptions = ((...args: any[]) => void )
export type LogFunctionWithOptions = ((opt: LogOptions, ...args: any[]) => void)
export type LogFunction = LogFunctionWithoutOptions & LogFunctionWithOptions
// , opt?: LogOptions
export interface Logger {
  debug: LogFunction,
  error: LogFunction,
  info: LogFunction,
  log: LogFunction,
  warn: LogFunction,
}

export const createLogger = (options: Partial<LogOptions> = {}) => {
  const logOptions = { ...defaultOptions, ...options }
  const logger: Logger = {
    debug: runLog(debugLog, logOptions),
    error: runLog(errorLog, logOptions),
    info:  runLog(infoLog, logOptions),
    log:   runLog(infoLog, logOptions),
    warn:  runLog(warnLog, logOptions),
  }

  return logger
}

export default createLogger()
