// utility functions using chalk to log stuff to the console
import chalk from "chalk"

// type for a simple function that logs it's arguments to the console
type LogFn = (...ags: any[]) => void

// setup functios to log stuff to terminal
const logDebug: LogFn = console.debug
const logInfo: LogFn  = console.info
const logWarn: LogFn  = console.log
const logErr: LogFn   = console.warn

// debug log
export const debug = (str: string, logFn: LogFn = logDebug) => logFn(
  `[${chalk.greenBright(`DEBUG`)}] ${str}`
)

// info log
export const info = (str: string, logFn: LogFn = logInfo) => logFn(
  `[${chalk.blueBright(`INFO`)}] ${str}`
)

// warn log
export const warn = (str: string, logFn: LogFn = logWarn) => logFn(
  `[${chalk.yellowBright(`WARN`)}] ${str}`
)

// error log
export const error = (str: string, logFn: LogFn = logErr) => logFn(
  `${chalk.red.bold.bgYellow(`[ERROR]`)} ${chalk.bold.redBright(str)}`
)  

export default {
  debug,
  error,
  info,
  log: info,
  warn,
}
