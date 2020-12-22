import { Schema, model, Model, Document, Types } from "mongoose"
import { AttributeNames } from "../../PlayerCharacter/Attribute"
import { SchemaFields } from "../helpers"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Pc {
  name: string,
  attributes: {
    [key in AttributeNames]: {
      value: number,
      bonus: number,
    }
  },
}

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
// interface SchemaFields extends Record<keyof AboveInterface, any> { [extraKey: string]: any }
const Attribute = {
  value: {
    type: Number,
    default: 0,
  },
  bonus: {
    type: Number,
    default: 0,
  },
}
const PcSchemaFields: SchemaFields<Pc> = {
  name: {
    type: String,
    required: true,
  },
  attributes: {
    Agility    : Attribute,
    Fortitude  : Attribute,
    Might      : Attribute,
    Learning   : Attribute,
    Logic      : Attribute,
    Perception : Attribute,
    Will       : Attribute,
    Deception  : Attribute,
    Persuasion : Attribute,
    Presence   : Attribute,
    Alteration : Attribute,
    Creation   : Attribute,
    Energy     : Attribute,
    Entropy    : Attribute,
    Influence  : Attribute,
    Movement   : Attribute,
    Prescience : Attribute,
    Protection : Attribute,
  }
}
export const PcSchema = new Schema<Pc>(PcSchemaFields)


// base document interface
interface BasePcDocument extends Pc, Document<Types.ObjectId> {}

// unpopulated document (this is what's returned by queries)
export interface PcDocument extends BasePcDocument {}
// populated document
export interface PcPopulatedDocument extends BasePcDocument {}

export const isPC = (obj: PcDocument | any): obj is PcDocument => 
  obj && typeof obj.title === 'string' && typeof obj.author === 'string' 

// interface for model, with all static methods defined
export interface PcModel extends Model<PcDocument> {}

// model to generate and query scrolls
export const PcModel = model<PcDocument, PcModel>("Pc", PcSchema)
export default PcModel
