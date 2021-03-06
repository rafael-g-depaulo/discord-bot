import { Document, Model, Types } from "mongoose"

import { ResourceDocument } from "../../PcResource"

import { Attribute, AttributeName, AttributeNames, Attributes, HighestAttribute } from "./Attribute"
export { Attribute, AttributeName, AttributeNames, Attributes, HighestAttribute }
import { ResourceScaling } from "./ResourceScaling"
export { ResourceScaling }
export * from "./methods"
export * from "./Rest"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Pc {
  name: string,
  level?: number,
  // hp & mp
  hp?: ResourceDocument,
  mp?: ResourceDocument,
  // guard & dodge
  guard?: DefenseDocument,
  dodge?: DefenseDocument,
  // attributes
  attributes: {
    [key in AttributeName]: {
      value: number,
      bonus: number,
    }
  },

  // attb used for attacks
  defaultAtkAttb?: AttributeName,
  // attbs used for determining hp/mp regained through rest
  hpDiceAttb?: AttributeName,
  mpDiceAttb?: AttributeName,
  // scaling for hp/mp
  hpScaling?: ResourceScaling,
  mpScaling?: ResourceScaling,
  // scaling for guard/dodge
  guardScaling?: DefenseScaling,
  dodgeScaling?: DefenseScaling,
}

// base document interface
import { updateMaxResources } from "../methods/updateMaxResources"
import { updateDefenses } from "../methods/updateDefenses"
import { rollInitiative } from "../methods/rollInitiative"
import { rollAttribute } from "../methods/rollAttribute"
import { takeDamage } from "../methods/takeDamage"
import { shortRest } from "../methods/shortRest"
import { longRest } from "../methods/longRest"
import { rollAtk } from "../methods/rollAtk"
import { rollDmg } from "../methods/rollDmg"
export interface BasePcDocument extends Pc, Document<Types.ObjectId> {
  updateMaxResources: updateMaxResources,
  updateDefenses: updateDefenses,
  rollInitiative: rollInitiative,
  rollAttribute: rollAttribute,
  takeDamage: takeDamage,
  shortRest: shortRest,
  longRest: longRest,
  rollAtk: rollAtk,
  rollDmg: rollDmg,

  // hp & mp
  hp: ResourceDocument,
  mp: ResourceDocument,
  
  // guard & dodge
  guard: DefenseDocument,
  dodge: DefenseDocument,
  AC: number,

  // level
  level: number,

  // get highest attribute of each kind
  highestPhysical: HighestAttribute,
  highestMental: HighestAttribute,
  highestSocial: HighestAttribute,
  highestSpecial: HighestAttribute,

  // attb used for attacks
  defaultAtkAttb: AttributeName,
  // attbs used for determining hp/mp regained through rest
  hpDiceAttb: AttributeName,
  mpDiceAttb: AttributeName,
  // scaling for hp/mp
  hpScaling: ResourceScaling,
  mpScaling: ResourceScaling,
  // scaling for guard/dodge
  guardScaling: DefenseScaling,
  dodgeScaling: DefenseScaling,
}
// unpopulated document (this is what's returned by queries)
export interface PcDocument extends BasePcDocument {}
// populated document
export interface PcPopulatedDocument extends BasePcDocument {}

// interface for model, with all static methods defined
import { create } from "../statics/create"
import { DefenseScaling } from "./DefenseScaling"
import { DefenseDocument } from "Models/PcDefense"
export interface PcModel extends Model<PcDocument> {
  createCharacter: create,
}
