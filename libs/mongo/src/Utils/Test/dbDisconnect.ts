import { Mongoose } from "mongoose"

import logger from "../logger"

export const dbDisconnect = (connPromise: Promise<Mongoose>, beforeDisconnect: (conn: Mongoose) => Promise<unknown> | unknown = () => {}) => {
  logger.debug("Lib: Mongo: start of dbDisconnect")
  // disconnect from mongodb after tests
  afterAll(async () => {
    const conn = await connPromise

    logger.debug("Lib: Mongo: running afterAll teardown")
    // if given, use callback before disconnecting
    const beforeDbDisconnect = async (c: Mongoose) => await beforeDisconnect(c)
    await beforeDbDisconnect(conn)
    
    // disconnect from db
    await conn?.disconnect()
  })
  logger.debug("Lib: Mongo: end of dbDisconnect")
}
