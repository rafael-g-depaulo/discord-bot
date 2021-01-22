import { model, models } from "../helpers"

// import and export types
import {
  Skill,
  SkillDocument,
  SkillPopulatedDocument,
  SkillModel as _SkillModel,
} from "./types"
export { Skill, SkillDocument, SkillPopulatedDocument }

// import and export helpers
export * from "./helpers"

// import and export schema
import { SkillSchema } from "./schema"
export { SkillSchema }

// import and define static methods
// import and define static methods

// import and define virtuals
// import and define virtuals

// import and define instance methods
// import and define instance methods

// model to generate and query scrolls
export const ModelName = "Skill"
export type SkillModel = _SkillModel
export const SkillModel = (models[ModelName] as SkillModel) || model<SkillDocument, SkillModel>(ModelName, SkillSchema)
export default SkillModel
