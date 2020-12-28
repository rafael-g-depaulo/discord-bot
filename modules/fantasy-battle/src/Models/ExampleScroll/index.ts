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
ScrollSchema.virtual("fullname").get(function(this: BaseScrollDocument) {
  return `${this.author}'s ${this.title}`
})

// define instance methods
ScrollSchema.methods.getNext = async function(this: BaseScrollDocument): Promise<ScrollDocument | null> {
  // if no nextLevel
  if (!this.nextLevel) return Promise.resolve(null)
  
  // if populated document
  if (isScroll(this.nextLevel)) {
    return Promise.resolve(this.nextLevel)
  }

  // if unpopulated document
  return await ScrollModel.findOne({ _id: this.nextLevel })
}

// model to generate and query scrolls
export type ScrollModel = _ScrollModel
export const ScrollModel = model<ScrollDocument, ScrollModel>("Scroll", ScrollSchema)
export default ScrollModel
