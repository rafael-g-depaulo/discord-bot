import logger from "./logger"
import { Mongoose } from "mongoose"

// utility function to drop all collections
export const dropAllCollections = (conn: Mongoose) => {
  // get all collections
  const collections = Object.values(conn?.connection.collections ?? {})  
  logger.debug("Utils/Mongo: Dropping all collections")
  // remove all items from all collections
  return Promise
    .all(collections.map(collection => collection
      .drop()
      .catch((err: { message: string }) => {
        // This error happens when you try to drop a collection that's already dropped. Happens infrequently. 
        // Safe to ignore. 
        if (err.message === 'ns not found') return
        // This error happens when you use it.todo.
        // Safe to ignore. 
        if (err.message.includes('a background operation is currently running')) return
        // else, throw error
        throw err
      })
    ))
}
