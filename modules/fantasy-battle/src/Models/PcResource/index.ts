import { model, models } from "mongoose"

// import and export types
import {
  Resource,
  ResourceDocument,
  ResourcePopulatedDocument,
  ResourceModel as _ResourceModel,
} from "./types"
export { Resource, ResourceDocument, ResourcePopulatedDocument }

// import and export helpers
// import and export helpers

// import and export schema
import { ResourceSchema } from "./schema"
export { ResourceSchema }

// import and define static methods
import createHp from "./statics/createHp"
ResourceSchema.statics.createHp = createHp
import createMp from "./statics/createMp"
ResourceSchema.statics.createMp = createMp


// import and define virtuals
import max from "./virtuals/max"
ResourceSchema.virtual("max").get(max.get)
  
// import and define instance methods
// import and define instance methods

// model to generate and query scrolls
export const ModelName = "Resource"
export type ResourceModel = _ResourceModel
export const ResourceModel = (models[ModelName] as ResourceModel) || model<ResourceDocument, ResourceModel>(ModelName, ResourceSchema)
export default ResourceModel
