import { model, models } from "../helpers"

// import and export types
import {
  Pc,
  PcDocument,
  PcPopulatedDocument,
  PcModel as _PcModel,
  Attribute,
  Attributes,
  AttributeName,
  AttributeNames,
  HighestAttribute,
} from "./types"
export {
  Pc,
  PcDocument,
  PcPopulatedDocument, 
  Attribute,
  Attributes,
  AttributeName,
  AttributeNames,
  HighestAttribute,
}

// import and export helpers
export * from "./helpers"

// import and export schema
import { PcSchema } from "./schema"
export { PcSchema }

// import and define static methods
import create from "./statics/create"
PcSchema.statics.createCharacter = create

// import and define virtuals
import highestPhysical from "./virtuals/highestPhysical"
PcSchema.virtual("highestPhysical").get(highestPhysical.get)
import highestMental from "./virtuals/highestMental"
PcSchema.virtual("highestMental").get(highestMental.get)
import highestSocial from "./virtuals/highestSocial"
PcSchema.virtual("highestSocial").get(highestSocial.get)
import highestSpecial from "./virtuals/highestSpecial"
PcSchema.virtual("highestSpecial").get(highestSpecial.get)
import AC from "./virtuals/AC"
PcSchema.virtual("AC").get(AC.get)
  
// import and define instance methods
import updateMaxResources from "./methods/updateMaxResources"
PcSchema.methods.updateMaxResources = updateMaxResources
import updateDefenses from "./methods/updateDefenses"
PcSchema.methods.updateDefenses = updateDefenses
import rollInitiative from "./methods/rollInitiative"
PcSchema.methods.rollInitiative = rollInitiative
import rollAttribute from "./methods/rollAttribute"
PcSchema.methods.rollAttribute = rollAttribute
import takeDamage from "./methods/takeDamage"
PcSchema.methods.takeDamage = takeDamage
import shortRest from "./methods/shortRest"
PcSchema.methods.shortRest = shortRest
import longRest from "./methods/longRest"
PcSchema.methods.longRest = longRest
import rollDmg from "./methods/rollDmg"
PcSchema.methods.rollDmg = rollDmg
import rollAtk from "./methods/rollAtk"
PcSchema.methods.rollAtk = rollAtk

// model to generate and query scrolls
export const ModelName = "Pc"
export type PcModel = _PcModel
export const PcModel = (models[ModelName] as PcModel) || model<PcDocument, PcModel>(ModelName, PcSchema)
export default PcModel
