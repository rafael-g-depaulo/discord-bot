import { Schema, model, Model, Document, Types } from "mongoose"
import { Relation, SchemaFields } from "./helpers"

// scroll interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Scroll {
  title: string,
  author: string,
  nextLevel?: Relation<ScrollDocument>,
}


// mongoDb schema to define data type
// this uses mongo types, not tipical typescript types
// relations show up here
// interface SchemaFields extends Record<keyof Scroll, any> { [extraKey: string]: any }
const ScrollSchemaFields: SchemaFields<Scroll> = {
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  nextLevel: {
    type: Schema.Types.ObjectId,
    ref: "Scroll",
  }
}
export const ScrollSchema = new Schema<Scroll>(ScrollSchemaFields)

// base scroll document interface
//! don't export it directly
// Document<T>: T means the type of the _id property. defaults to any
interface BaseScrollDocument extends Scroll, Document<string> {
  // any Array<T> in the Scroll interface becomes overwritten as Types.array<T> here. same for Maps and other stuff

  // virtual properties should be defined here
  fullname: string,

  // instance methods are defined here too
  getNext(): ScrollDocument | undefined
}

// unpopulated scroll document (this is what's returned by queries)
export interface ScrollDocument extends BaseScrollDocument {
  //! relations are defined here as id's of other models
  nextLevel?: ScrollDocument["_id"],
}

// populated scroll document (a scroll document, but with the relations populated instead of just id's)
export interface ScrollPopulatedDocument extends BaseScrollDocument {
  //! relations are defined here as instances of the other models (this is what makes it populated)
  nextLevel?: ScrollDocument,
}

// interface for model, with all static methods defined
export interface ScrollModel extends Model<ScrollDocument> {
  getByAuthor(author: string): Promise<ScrollDocument[]>
}

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
ScrollSchema.methods.getNext = function(this: BaseScrollDocument) {
  return this
}

// model to generate and query scrolls
export const ScrollModel = model<ScrollDocument, ScrollModel>("Scroll", ScrollSchema)
export default ScrollModel
