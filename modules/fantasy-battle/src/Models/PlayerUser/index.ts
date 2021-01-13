import { model, models } from "mongoose"

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
import fromAuthor from "./statics/fromAuthor"
PlayerUserSchema.statics.fromAuthor = fromAuthor

// import and define virtuals
import activeChar from "./virtuals/activeChar"
PlayerUserSchema.virtual("activeChar").get(activeChar.get)
  
// import and define instance methods
import addCharacter from "./methods/addCharacter"
PlayerUserSchema.methods.addCharacter = addCharacter
import removeCharacter from "./methods/removeCharacter"
PlayerUserSchema.methods.removeCharacter = removeCharacter
import getCharacter from "./methods/getCharacter"
PlayerUserSchema.methods.getCharacter = getCharacter

// model to generate and query scrolls
export const ModelName = "PlayerUser"
export type PlayerUserModel = _PlayerUserModel
export const PlayerUserModel = (models[ModelName] as _PlayerUserModel) || model<PlayerUserDocument, PlayerUserModel>(ModelName, PlayerUserSchema)
export default PlayerUserModel
