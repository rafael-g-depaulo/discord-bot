import { Schema } from "mongoose"
import { string } from "yargs"
import { SchemaFields } from "../helpers"

import { Pc } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
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
  },
  defaultAtkAttb: {
    type: String,
    default: "Might",
  },
}
export const PcSchema = new Schema<Pc>(PcSchemaFields)
