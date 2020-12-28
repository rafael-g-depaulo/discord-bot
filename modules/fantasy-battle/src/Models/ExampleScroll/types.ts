import { Relation } from "../helpers"
import { Document, Model, Types } from "mongoose"

// scroll interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Scroll {
  title: string,
  author: string,
  nextLevel?: Relation<ScrollDocument>,
}

// base scroll document interface
// Document<T>: T means the type of the _id property. defaults to any
export interface BaseScrollDocument extends Scroll, Document<Types.ObjectId> {
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
