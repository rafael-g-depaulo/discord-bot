import { isLogOptions, LogOptions } from "./logOptions"

// function that handles data/options and sends it to a LogFn so it may send it to the terminal
export type LogFunctionWithoutOptions = ((...args: any[]) => void )
export type LogFunctionWithOptions = ((opt: LogOptions, ...args: any[]) => void)
export type LogFunction = LogFunctionWithoutOptions & LogFunctionWithOptions

// function to differenciate on log calls using options object or not
export const runLog = (lfn: LogFunctionWithOptions, options: LogOptions): LogFunction => (possibleOptionsOverride: LogOptions | any, ...args: any[]) => {
  // start with default options, and use givenOptions when given
  // const options = { ...defaultOptions, ...givenOpts }

  if (isLogOptions(possibleOptionsOverride)) {
    // log the rest of the args, using options override
    return lfn({ ...options, ...possibleOptionsOverride }, ...args)
  }
  
  // just log, with current options
  return lfn(options, possibleOptionsOverride, ...args)
}
