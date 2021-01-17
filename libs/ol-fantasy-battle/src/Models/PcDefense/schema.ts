import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { Defense } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
const DefenseSchemaFields: SchemaFields<Defense> = {
  value: {
    type: Number,
    default: 0,
    required: true,
  },
  bonus: {
    type: Number,
    default: 0,
    required: true,
  },
}
export const DefenseSchema = new Schema<Defense>(DefenseSchemaFields)
