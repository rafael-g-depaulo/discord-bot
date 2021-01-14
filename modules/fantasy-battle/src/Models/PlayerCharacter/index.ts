import { model, models } from "mongoose"

// import and export types
import {
  Pc,
  PcDocument,
  PcPopulatedDocument,
  PcModel as _PcModel,
} from "./types"
export { Pc, PcDocument, PcPopulatedDocument }

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
  
// import and define instance methods
import updateMaxResources from "./methods/updateMaxResources"
PcSchema.methods.updateMaxResources = updateMaxResources
import rollAttribute from "./methods/rollAttribute"
PcSchema.methods.rollAttribute = rollAttribute
import rollDmg from "./methods/rollDmg"
PcSchema.methods.rollDmg = rollDmg

// model to generate and query scrolls
export const ModelName = "Pc"
export type PcModel = _PcModel
export const PcModel = (models[ModelName] as PcModel) || model<PcDocument, PcModel>(ModelName, PcSchema)
export default PcModel
