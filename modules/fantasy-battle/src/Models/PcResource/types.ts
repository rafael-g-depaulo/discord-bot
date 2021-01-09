import { InstanceMethod, Relation, StaticMethod, VirtualGetter } from "../helpers"
import { Document, Model, Types } from "mongoose"

// scroll interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Resource {
  // current hp/mp points
  current: number,
  // maximum hp/mp points determined by formula
  base_max: number,
  // extra maximum hp/mp point given by other means (feats)
  bonus_max: number,
  // temporary hp/mp given by buffs
  temporary: number,
}

// base scroll document interface
// Document<T>: T means the type of the _id property. defaults to any
export interface BaseResourceDocument extends Resource, Document<Types.ObjectId> {
  // maximum hp/mp (is equal to base_max + bonus_max)
  max: number,
}

// unpopulated scroll document (this is what's returned by queries)
export interface ResourceDocument extends BaseResourceDocument {
}

// populated scroll document (a scroll document, but with the relations populated instead of just id's)
export interface ResourcePopulatedDocument extends BaseResourceDocument {
}

// interface for model, with all static methods defined
import { createHp } from "./statics/createHp"
import { createMp } from "./statics/createMp"
export interface ResourceModel extends Model<ResourceDocument> {
  createHp: createHp,
  createMp: createMp,
}

// type defition for instance method
export interface ResourceInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BaseResourceDocument, M> {}
// type defition for instance method
export interface ResourceStaticMethod<M extends (...args: any) => any> extends StaticMethod<ResourceDocument, ResourceModel, M> {}
// type defition for a function defining an instance virtual property
export interface ResourceVirtualGetter<T> extends VirtualGetter<BaseResourceDocument, T> {}
