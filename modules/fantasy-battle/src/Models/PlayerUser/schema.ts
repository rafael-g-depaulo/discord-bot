import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { PcSchema } from "../PlayerCharacter"
import { PlayerUser } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
const PlayerUserSchemaFields: SchemaFields<PlayerUser> = {
  userId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  characters: [{
    type: PcSchema,
  }]
}
export const PlayerUserSchema = new Schema<PlayerUser>(PlayerUserSchemaFields)
