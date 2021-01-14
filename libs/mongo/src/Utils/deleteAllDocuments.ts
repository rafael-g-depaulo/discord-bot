import logger from "./logger"
import { Mongoose } from "mongoose"

// utility function to remove all documents from all collections
export const deleteAllDocuments = (conn: Mongoose) => {
  // get all collections
  const collections = Object.values(conn?.connection.collections ?? {})
  logger.debug("Utils/Mongo: Deleting all documents from all collections")
  // for all collections, remove all documents
  return Promise.all(collections
    .map(collection => collection.deleteMany({}))
  )
}
