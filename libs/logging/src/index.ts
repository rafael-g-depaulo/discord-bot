import createLogger from "createLogger"

// types for logOptions
export { LogLevel, LogOptions } from "./logOptions"

// funcion to create own logger
export { createLogger } from "./createLogger"

// export default log functions
export {
  debug,
  info,
  warn,
  error,
} from "./logFunctions"

// export simple logger as default for 0-config use
export default createLogger()
