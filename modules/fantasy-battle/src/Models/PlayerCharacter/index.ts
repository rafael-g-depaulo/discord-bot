import { model } from "mongoose"

// import and export types
import {
  Pc,
  PcDocument,
  PcPopulatedDocument,
  PcModel as _PcModel,
} from "./types"
export { Pc, PcDocument, PcPopulatedDocument }

// import and export helpers
export { isPC } from "./helpers"

// import and export schema
import { PcSchema } from "./schema"
export { PcSchema }

// import and define static methods
import create from "./statics/create"
PcSchema.statics.createCharacter = create

// import and define virtuals
// import virtualName from "./virtuals/virtualName"
// PcSchema.virtual("virtualName").get(virtualName.get)
  
// import and define instance methods
// import instanceMethodName from "./methods/instanceMethodName"
// PcSchema.methods.instanceMethodName = instanceMethodName

// model to generate and query scrolls
export type PcModel = _PcModel
export const PcModel = model<PcDocument, PcModel>("Pc", PcSchema)
export default PcModel
