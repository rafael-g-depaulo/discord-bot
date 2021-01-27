import { Schema } from "mongoose"
import { SchemaFields } from "../helpers"

import { DefenseSchema } from "../PcDefense"
import { ResourceSchema } from "../PcResource"
import { SkillSchema } from "../Skill"
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
const ScalingItem = {
  type: Number,
  default: 0,
  required: true,
}
const ResourceScaling = {
  base:       ScalingItem,  level:      ScalingItem,  bonus:      ScalingItem,
  Agility:    ScalingItem,  Fortitude:  ScalingItem,  Might:      ScalingItem,
  Learning:   ScalingItem,  Logic:      ScalingItem,  Perception: ScalingItem,
  Will:       ScalingItem,  Deception:  ScalingItem,  Persuasion: ScalingItem,
  Presence:   ScalingItem,  Alteration: ScalingItem,  Creation:   ScalingItem,
  Energy:     ScalingItem,  Entropy:    ScalingItem,  Influence:  ScalingItem,
  Movement:   ScalingItem,  Prescience: ScalingItem,  Protection: ScalingItem,
  highestPhysical: ScalingItem, highestMental:   ScalingItem,
  highestSocial:   ScalingItem, highestSpecial:  ScalingItem,
}
const DefenseScaling = ResourceScaling
const defaultResource =  { current: 0, base_max: 0, bonus_max: 0, temporary: 0 }
const defaultDefense = { value: 0, current: 0 }
const PcSchemaFields: SchemaFields<Pc> = {
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
    default: 1,
  },
  hp: {
    type: ResourceSchema,
    default: defaultResource,
    required: true,
  },
  mp: {
    type: ResourceSchema,
    default: defaultResource,
    required: true,
  },
  guard: {
    type: DefenseSchema,
    default: defaultDefense,
    required: true,
  },
  dodge: {
    type: DefenseSchema,
    default: defaultDefense,
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
    required: true,
  },
  hpDiceAttb: {
    type: String,
    default: "Fortitude",
    required: true,
  },
  mpDiceAttb: {
    type: String,
    default: "Learning",
    required: true,
  },
  hpScaling: {
    ...ResourceScaling,
    base:      { ...ScalingItem, default: 8 },
    level:     { ...ScalingItem, default: 2 },
    Fortitude: { ...ScalingItem, default: 2 },
    Might:     { ...ScalingItem, default: 1.5 },
    Presence:  { ...ScalingItem, default: 1.5 },
    Will:      { ...ScalingItem, default: 1 },
  },
  mpScaling: {
    ...ResourceScaling,
    base:      { ...ScalingItem, default: 8 },
    level:     { ...ScalingItem, default: 2 },
    Learning:  { ...ScalingItem, default: 2 },
    Logic:     { ...ScalingItem, default: 1.5 },
    highestSpecial: { ...ScalingItem, default: 1.5 },
    Will:      { ...ScalingItem, default: 1 },
  },
  guardScaling: {
    ...DefenseScaling,
    Might:      { ...ScalingItem, default: 1 },
    Fortitude:  { ...ScalingItem, default: 0.75 },
    Protection: { ...ScalingItem, default: 0.5 },
  },
  dodgeScaling: {
    ...DefenseScaling,
    Agility:    { ...ScalingItem, default: 0.75 },
    Perception: { ...ScalingItem, default: 0.5 },
    Deception:  { ...ScalingItem, default: 1 },
  },
  skills: [{
    type: SkillSchema,
  }],
}
export const PcSchema = new Schema<Pc>(PcSchemaFields)
