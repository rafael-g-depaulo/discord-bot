import { InstanceMethod, StaticMethod, VirtualGetter } from "../helpers"
import { Document, Model, Types } from "mongoose"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Attribute {
  value: number,
  bonus: number,
}
export interface HighestAttribute extends Attribute {
  name: AttributeName,
}
export type Attributes = {
  [key in AttributeName]: Attribute
}

export type AttributeName =
  "Agility"    | "Fortitude"  | "Might"      | "Learning"  |
  "Logic"      | "Perception" | "Will"       | "Deception" |
  "Persuasion" | "Presence"   | "Alteration" | "Creation"  |
  "Energy"     | "Entropy"    | "Influence"  | "Movement"  |
  "Prescience" | "Protection"

export const AttributeNames: AttributeName[] = [
  "Agility"    , "Fortitude"  , "Might"      , "Learning"  ,
  "Logic"      , "Perception" , "Will"       , "Deception" ,
  "Persuasion" , "Presence"   , "Alteration" , "Creation"  ,
  "Energy"     , "Entropy"    , "Influence"  , "Movement"  ,
  "Prescience" , "Protection" ,
]

export interface Pc {
  name: string,
  level?: number,
  // hp & mp
  hp?: ResourceDocument,
  mp?: ResourceDocument,

  // attributes
  attributes: {
    [key in AttributeName]: {
      value: number,
      bonus: number,
    }
  },

  defaultAtkAttb?: AttributeName,
  // scaling for hp/mp
  hpScaling?: Scaling,
  mpScaling?: Scaling,
}


// base document interface
import { updateMaxResources } from "./methods/updateMaxResources"
import { rollAttribute } from "./methods/rollAttribute"
import { rollAtk } from "./methods/rollAtk"
import { rollDmg } from "./methods/rollDmg"
export interface BasePcDocument extends Pc, Document<Types.ObjectId> {
  updateMaxResources: updateMaxResources,
  rollAttribute: rollAttribute,
  rollAtk: rollAtk,
  rollDmg: rollDmg,

  // hp & mp
  hp: ResourceDocument,
  mp: ResourceDocument,

  // level
  level: number,

  // get highest attribute of each kind
  highestPhysical: HighestAttribute,
  highestMental: HighestAttribute,
  highestSocial: HighestAttribute,
  highestSpecial: HighestAttribute,

  defaultAtkAttb: AttributeName,
  // scaling for hp/mp
  hpScaling: Scaling,
  mpScaling: Scaling,
}
// unpopulated document (this is what's returned by queries)
export interface PcDocument extends BasePcDocument {}
// populated document
export interface PcPopulatedDocument extends BasePcDocument {}


// interface for model, with all static methods defined
import { create } from "./statics/create"
import { ResourceDocument } from "../../Models/PcResource"
export interface PcModel extends Model<PcDocument> {
  createCharacter: create,
}


// type defition for instance method
export interface PcInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BasePcDocument, M> {}
// type defition for instance method
export interface PcStaticMethod<M extends (...args: any) => any> extends StaticMethod<PcDocument, PcModel, M> {}
// type defition for a function defining an instance virtual property
export interface PcVirtualGetter<T> extends VirtualGetter<BasePcDocument, T> {}

// type that determines the scaling for a resource (hp/mp)
type Scaling = {
  // level scaling
  level: number,
  // base hp/mp
  base: number,
  // bonus hp/mp
  bonus: number,

  // highest attribute of a single kind
  highestPhysical: number,
  highestMental: number,
  highestSocial: number,
  highestSpecial: number,

// one entry for every attribute
} & { [key in AttributeName]: number }