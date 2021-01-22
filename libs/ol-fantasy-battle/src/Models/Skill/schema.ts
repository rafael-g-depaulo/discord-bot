import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { Skill } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
const SkillSchemaFields: SchemaFields<Skill> = {
}
export const SkillSchema = new Schema<Skill>(SkillSchemaFields)
