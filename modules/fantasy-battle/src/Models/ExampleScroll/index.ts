import { model, models } from "mongoose"

// import and export types
import {
  Scroll,
  ScrollDocument,
  ScrollPopulatedDocument,
  ScrollModel as _ScrollModel,
} from "./types"
export { Scroll, ScrollDocument, ScrollPopulatedDocument }

// import and export helpers
export { isScroll } from "./helpers"

// import and export schema
import { ScrollSchema } from "./schema"
export { ScrollSchema }

// import and define static methods
import getByAuthor from "./statics/getByAuthor"
ScrollSchema.statics.getByAuthor = getByAuthor

// import and define virtuals
import fullname from "./virtuals/fullname"
ScrollSchema.virtual("fullname").get(fullname.get)
  
// import and define instance methods
import getNext from "./methods/getNext"
ScrollSchema.methods.getNext = getNext

// model to generate and query scrolls
export const ModelName = "Scroll"
export type ScrollModel = _ScrollModel
export const ScrollModel = (models[ModelName] as _ScrollModel) || model<ScrollDocument, ScrollModel>(ModelName, ScrollSchema)
export default ScrollModel
