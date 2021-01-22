import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { Skill } from "./types"

// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
const SkillSchemaFields: SchemaFields<Skill> = {
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionType: {
    type: String,
    required: true,
    default: "major",
  },
  damageOrHeal: {
    type: String,
    required: true,
    default: "none",
  },
  skillType: {
    type: String,
    required: true,
    default: "misc",
  },
  damageType: {
    type: String,
  },
  hpCost: {
    type: Number,
    required: true,
    default: 0,
  },
  mpCost: {
    type: Number,
    required: true,
    default: 0,
  },
  attribute: {
    type: String,
  },
  bonus: {
    type: Number,
    default: 0,
  },
  advantage: {
    type: Number,
    default: 0,
  },
  atkRoll: {
    type: String,
  },
  dmgAttribute: {
    type: String,
  },
  dmgAttributeBonus: {
    type: Number,
    default: 0,
  },
  dmgAdvantage: {
    type: Number,
    default: 0,
  },
  dmgExplosion: {
    type: Number,
    default: 0,
  },
  dmgRoll: {
    type: String,
    default: "",
  },
}
export const SkillSchema = new Schema<Skill>(SkillSchemaFields)
