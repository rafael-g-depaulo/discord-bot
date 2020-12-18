import connect from "Db"
import { Mongoose } from "mongoose"
import logger from "./logger"

import { deleteAllDocuments, dropAllCollections } from "./mongo"

export const dbConnect: (dbName: string) => Promise<Mongoose> = (dbName: string = "test") => new Promise((resolve, reject) => {
  // connect to mongodb before tests
  let conn: Mongoose
  beforeAll(async done => {
    try {
      logger.debug(`Utils/MongoTest: connecting to database "${dbName}"`)
      // connect to db
      conn = await connect({ dbName })
      resolve(conn)
    } catch (err) {
      reject(err)
    }
    // start tests after connection is estabilished
    done()
  })
})

export const dbDisconnect = (connPromise: Promise<Mongoose>, beforeDisconnect: (conn: Mongoose) => Promise<unknown> | unknown = () => {}) => {
  logger.debug("Utils/MongoTest: start of dbDisconnect")
  // disconnect from mongodb after tests
  afterAll(async () => {
    const conn = await connPromise

    logger.debug("Utils/MongoTest: running afterAll teardown")
    // if given, use callback before disconnecting
    const beforeDbDisconnect = async (c: Mongoose) => await beforeDisconnect(c)
    await beforeDbDisconnect(conn)
    
    // disconnect from db
    await conn?.disconnect()
  })
  logger.debug("Utils/MongoTest: end of dbDisconnect")
}

export interface ConnectionHooks {
  afterEachTest: (conn: Mongoose) => Promise<unknown> | unknown
  beforeDisconnect: (conn: Mongoose) => Promise<unknown> | unknown
}
const defaultHooks = {
  afterEachTest: deleteAllDocuments,
  beforeDisconnect: dropAllCollections,
}
export const useDbConnection = (dbName: string = "test", hooks: Partial<ConnectionHooks> = {}) => {

  logger.debug("Utils/MongoTest: start of useDbConnection")
  
  // before all tests connect to db
  const connPromise = dbConnect(dbName)

  // get callbacks to be ran inbetween tests and after all, right before disconnection
  const { afterEachTest, beforeDisconnect } = { ...defaultHooks, ...hooks }

  // run afterEach tests
  afterEach(async () => { afterEachTest(await connPromise) })

  // after all tests run beforeDisconnect callback and then disconnect
  dbDisconnect(connPromise, beforeDisconnect)
  
  logger.debug("Utils/MongoTest: end of useDbConnection")
}
