import { get } from "https"
import mongoose, { ConnectOptions } from "mongoose"

export interface DbConfig extends ConnectOptions {
  url: string,  // url with mongo location
}

export const getDefaultDbConfig: () => DbConfig = () => ({
  url: process.env.MONGODB_URL ?? "mongodb://localhost:27017",
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

export const connect = ({ url, ...connectOptions }: DbConfig = getDefaultDbConfig()) => mongoose
  .connect(url, connectOptions)

export default connect
