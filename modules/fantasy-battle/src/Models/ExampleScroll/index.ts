import { model } from "mongoose"

// import and export types
import {
  Scroll,
  BaseScrollDocument, // dont't export BaseScrollDocument
  ScrollDocument,
  ScrollPopulatedDocument,
  ScrollModel as _ScrollModel,
} from "./types"
export { Scroll, ScrollDocument, ScrollPopulatedDocument }

// import and export helpers
import { isScroll } from "./helpers"
export { isScroll }

// import and export schema
import { ScrollSchema } from "./schema"
export { ScrollSchema }

// define static methods
ScrollSchema.statics.getByAuthor = function(
  this: ScrollModel,
  author: string,
) {
  return this.find({ author })
}

// define virtuals
import fullname from "./virtuals/fullname"
ScrollSchema.virtual("fullname").get(fullname.get)
  
// import and define instance methods
import getNext from "./methods/getNext"
ScrollSchema.methods.getNext = getNext

// model to generate and query scrolls
export type ScrollModel = _ScrollModel
export const ScrollModel = model<ScrollDocument, ScrollModel>("Scroll", ScrollSchema)
export default ScrollModel
