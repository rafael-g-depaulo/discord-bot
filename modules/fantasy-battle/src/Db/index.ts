import mongoose, { ConnectOptions } from "mongoose"

export interface DbConfig extends ConnectOptions {
  url: string,      // url with mongo location
  dbName?: string,  //name of database
}

export const getDefaultDbConfig: () => DbConfig = () => ({
  url: process.env.MONGODB_URL ?? "mongodb://localhost:27017",
  dbName: "",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export const connect = (config: Partial<DbConfig> = {}) => {
  // get config (use user given config, or default if a field wasn't specified)
  const { url, dbName, ...connectOptions } = {
    ...getDefaultDbConfig(),
    ...config,
  }

  return mongoose.connect(`${url}/${dbName}`, connectOptions)
}

export default connect
