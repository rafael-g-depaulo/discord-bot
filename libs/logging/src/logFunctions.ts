import chalk from "chalk"

import { LogFunctionWithOptions, runLog } from "./runLog"
import { processArgsIntoString } from "./utils"
import { getDefaultOptions, isAboveLevel, LogLevel, LogOptions } from "./logOptions"

// debug log
export const debugLog: LogFunctionWithOptions = ({ logFn = console.debug, ...logOpts }, ...args) => 
  isAboveLevel("debug", logOpts) &&
  logFn(`[${chalk.greenBright(`DEBUG`)}] ${processArgsIntoString(args)}`)

// info log
export const infoLog: LogFunctionWithOptions = ({ logFn = console.info, ...logOpts  }, ...args) => 
  isAboveLevel("info", logOpts) &&
  logFn(`[${chalk.blueBright(`INFO`)}] ${processArgsIntoString(args)}`)

// warn log
export const warnLog: LogFunctionWithOptions = ({ logFn = console.warn, ...logOpts  }, ...args) =>
  isAboveLevel("warning", logOpts) &&
  logFn(`[${chalk.yellowBright(`WARN`)}] ${processArgsIntoString(args)}`)

// error log
export const errorLog: LogFunctionWithOptions = ({ logFn = console.error, ...logOpts  }, ...args) => 
  isAboveLevel("error", logOpts) &&
  // TODO: change how the bold.redbright is used here to only apply to string, and leave the rest
  logFn(`${chalk.red.bold.bgYellow(`[ERROR]`)} ${chalk.bold.redBright(processArgsIntoString(args))}`)

// default logging functions (these don't need options, but may take it as parameters)
export const debug = runLog(debugLog, getDefaultOptions())
export const info = runLog(infoLog, getDefaultOptions())
export const warn = runLog(warnLog, getDefaultOptions())
export const error = runLog(errorLog, getDefaultOptions())
