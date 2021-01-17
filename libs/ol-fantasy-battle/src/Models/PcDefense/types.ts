import { InstanceMethod, Relation, StaticMethod, VirtualGetter } from "../helpers"
import { Document, Model, Types } from "mongoose"

// scroll interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Defense {
  // guard/dodge value
  value: number,
  // bonus guard/dodge
  bonus: number,
}

// base scroll document interface
// Document<T>: T means the type of the _id property. defaults to any
export interface BaseDefenseDocument extends Defense, Document<Types.ObjectId> {
  // gets the total value for the guard/dodge (this equals .value + .bonus)
  total: number,
}

// unpopulated scroll document (this is what's returned by queries)
export interface DefenseDocument extends BaseDefenseDocument {
}

// populated scroll document (a scroll document, but with the relations populated instead of just id's)
export interface DefensePopulatedDocument extends BaseDefenseDocument {
}

// interface for model, with all static methods defined
import { createGuard } from "./statics/createGuard"
import { createDodge } from "./statics/createDodge"
export interface DefenseModel extends Model<DefenseDocument> {
  createGuard: createGuard,
  createDodge: createDodge,
}

// type defition for instance method
export interface DefenseInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BaseDefenseDocument, M> {}
// type defition for instance method
export interface DefenseStaticMethod<M extends (...args: any) => any> extends StaticMethod<DefenseDocument, DefenseModel, M> {}
// type defition for a function defining an instance virtual property
export interface DefenseVirtualGetter<T> extends VirtualGetter<BaseDefenseDocument, T> {}
