import { model, models } from "../helpers"

// import and export types
import {
  Defense,
  DefenseDocument,
  DefensePopulatedDocument,
  DefenseModel as _DefenseModel,
} from "./types"
export { Defense, DefenseDocument, DefensePopulatedDocument }

// import and export helpers
export * from "./helpers"

// import and export schema
import { DefenseSchema } from "./schema"
export { DefenseSchema }

// import and define static methods
import createGuard from "./statics/createGuard"
DefenseSchema.statics.createGuard = createGuard
import createDodge from "./statics/createDodge"
DefenseSchema.statics.createDodge = createDodge

// import and define virtuals
import total from "./virtuals/total"
DefenseSchema.virtual("total").get(total.get)
  
// import and define instance methods
// import and define instance methods

// model to generate and query scrolls
export const ModelName = "Defense"
export type DefenseModel = _DefenseModel
export const DefenseModel = (models[ModelName] as DefenseModel) || model<DefenseDocument, DefenseModel>(ModelName, DefenseSchema)
export default DefenseModel
