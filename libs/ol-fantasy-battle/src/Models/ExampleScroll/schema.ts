import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { Scroll } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
const ScrollSchemaFields: SchemaFields<Scroll> = {
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  nextLevel: {
    type: Schema.Types.ObjectId,
    ref: "Scroll",
  }
}
export const ScrollSchema = new Schema<Scroll>(ScrollSchemaFields)
