import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { Resource } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
const ResourceSchemaFields: SchemaFields<Resource> = {
  current: {
    type: Number,
    default: 0,
    required: true,
  },
  temporary: {
    type: Number,
    default: 0,
    required: true,
  },
  base_max: {
    type: Number,
    default: 0,
    required: true,
  },
  bonus_max: {
    type: Number,
    default: 0,
    required: true,
  }
}
export const ResourceSchema = new Schema<Resource>(ResourceSchemaFields)
