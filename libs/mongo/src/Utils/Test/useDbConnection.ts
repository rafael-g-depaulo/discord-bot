import { Mongoose } from "mongoose"

import { deleteAllDocuments } from "../../Utils/deleteAllDocuments"
import { dropAllCollections } from "../../Utils/dropAllCollections"
import logger from "../../Utils/logger"

import { dbConnect } from "./dbConnect"
import { dbDisconnect } from "./dbDisconnect"

export interface ConnectionHooks {
  afterEachTest: (conn: Mongoose) => Promise<unknown> | unknown
  beforeDisconnect: (conn: Mongoose) => Promise<unknown> | unknown
}
const defaultHooks = {
  afterEachTest: deleteAllDocuments,
  beforeDisconnect: dropAllCollections,
}
export const useDbConnection = (dbName: string = "test", hooks: Partial<ConnectionHooks> = {}) => {

  logger.debug("Lib: Mongo: start of useDbConnection")
  
  // before all tests connect to db
  const connPromise = dbConnect(dbName)

  // get callbacks to be ran inbetween tests and after all, right before disconnection
  const { afterEachTest, beforeDisconnect } = { ...defaultHooks, ...hooks }

  // run afterEach tests
  afterEach(async () => { afterEachTest(await connPromise) })

  // after all tests run beforeDisconnect callback and then disconnect
  dbDisconnect(connPromise, beforeDisconnect)
  
  logger.debug("Lib: Mongo: end of useDbConnection")
}
