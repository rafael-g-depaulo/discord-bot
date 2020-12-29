import { model } from "mongoose"

// import and export types
import {
  PlayerUser,
  PlayerUserDocument,
  PlayerUserPopulatedDocument,
  PlayerUserModel as _PlayerUserModel,
} from "./types"
export { PlayerUser, PlayerUserDocument, PlayerUserPopulatedDocument }

// import and export helpers
export { isPlayerUser } from "./helpers"

// import and export schema
import { PlayerUserSchema } from "./schema"
export { PlayerUserSchema }

// define static methods
import getUser from "./statics/getUser"
PlayerUserSchema.statics.getUser = getUser
import create from "./statics/create"
PlayerUserSchema.statics.createUser = create
import getOrCreate from "./statics/getOrCreate"
PlayerUserSchema.statics.getOrCreate = getOrCreate

// import and define virtuals
// import virtualName from "./virtuals/virtualName"
// PlayerUserSchema.virtual("virtualName").get(virtualName.get)
  
// import and define instance methods
import addCharacter from "./methods/addCharacter"
PlayerUserSchema.methods.addCharacter = addCharacter

// model to generate and query scrolls
export type PlayerUserModel = _PlayerUserModel
export const PlayerUserModel = model<PlayerUserDocument, PlayerUserModel>("PlayerUser", PlayerUserSchema)
export default PlayerUserModel
