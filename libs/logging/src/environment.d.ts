declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // node env
      NODE_ENV: 'development' | 'production' | 'test',
      PWD: string;
  
      // log level
      LOG_LEVEL?: "debug" | "info" | "warn" | "error" | "none" | "",
      // whether or not tests should be logged
      LOG_TESTS?: "true" | "false" | "",
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}
