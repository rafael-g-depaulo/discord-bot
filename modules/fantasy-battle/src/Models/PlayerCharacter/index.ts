import { Schema, model, Model, Document, Types } from "mongoose"
import { Relation, SchemaFields } from "../helpers"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface PlayerCharacter {
}

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
// interface SchemaFields extends Record<keyof AboveInterface, any> { [extraKey: string]: any }
const PlayerCharacterSchemaFields: SchemaFields<PlayerCharacter> = {

}
export const PlayerCharacterSchema = new Schema<PlayerCharacter>(PlayerCharacterSchemaFields)


// base document interface
interface BasePlayerCharacterDocument extends PlayerCharacter, Document<Types.ObjectId> {}

// unpopulated document (this is what's returned by queries)
export interface PlayerCharacterDocument extends BasePlayerCharacterDocument {}

export const isPC = (obj: PlayerCharacterDocument | any): obj is PlayerCharacterDocument => 
  obj && typeof obj.title === 'string' && typeof obj.author === 'string' 

// interface for model, with all static methods defined
export interface PlayerCharacterModel extends Model<PlayerCharacterDocument> {}

// model to generate and query scrolls
export const PlayerCharacterModel = model<PlayerCharacterDocument, PlayerCharacterModel>("PlayerCharacter", PlayerCharacterSchema)
export default PlayerCharacterModel
