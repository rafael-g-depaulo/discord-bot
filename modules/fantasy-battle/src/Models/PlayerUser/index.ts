import { PcDocument, PcSchema } from "../PlayerCharacter"
import { Schema, model, Model, Document, Types } from "mongoose"
import { Relation, SchemaFields } from "../helpers"

// PlayerUser interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface PlayerUser {
  // user's discord id
  userId: string,
  // user's characters
  characters: PcDocument[],
}

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
// interface SchemaFields extends Record<keyof AboveInterface, any> { [extraKey: string]: any }
const PlayerUserSchemaFields: SchemaFields<PlayerUser> = {
  userId: {
    type: String,
    required: true,
  },
  characters: [{
    type: PcSchema,
  }]
}
export const PlayerUserSchema = new Schema<PlayerUser>(PlayerUserSchemaFields)

// base document interface
interface BasePlayerUserDocument extends PlayerUser, Document<Types.ObjectId> {}
// unpopulated document (this is what's returned by queries)
export interface PlayerUserDocument extends BasePlayerUserDocument {}
// populated document
export interface PlayerUserPopulatedDocument extends BasePlayerUserDocument {}

export const isPlayerUser = (obj: PlayerUserDocument | any): obj is PlayerUserDocument => 
  obj && typeof obj.userId === 'string' && Array.isArray(obj.characters)


// define static methods
PlayerUserSchema.statics.getUser = async function (
  this: PlayerUserModel,
  userId: string,
) {
  return await this.findOne({ userId })
}

// interface for model, with all static methods defined
export interface PlayerUserModel extends Model<PlayerUserDocument> {
  getUser: (userId: string) => Promise<PlayerUserDocument | null>
}
// model to generate and query scrolls
export const PlayerUserModel = model<PlayerUserDocument, PlayerUserModel>("PlayerUser", PlayerUserSchema)
export default PlayerUserModel
