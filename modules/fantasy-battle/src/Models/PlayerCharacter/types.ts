import { InstanceMethod, StaticMethod, VirtualGetter } from "../helpers"
import { Document, Model, Types } from "mongoose"

import { AttributeNames } from "../../PlayerCharacter/Attribute"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Pc {
  name: string,
  attributes: {
    [key in AttributeNames]: {
      value: number,
      bonus: number,
    }
  },
}


// base document interface
export interface BasePcDocument extends Pc, Document<Types.ObjectId> {}
// unpopulated document (this is what's returned by queries)
export interface PcDocument extends BasePcDocument {}
// populated document
export interface PcPopulatedDocument extends BasePcDocument {}


// interface for model, with all static methods defined
import { create } from "./statics/create"
export interface PcModel extends Model<PcDocument> {
  createCharacter: create,
}


// type defition for instance method
export interface PcInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BasePcDocument, M> {}
// type defition for instance method
export interface PcStaticMethod<M extends (...args: any) => any> extends StaticMethod<PcDocument, PcModel, M> {}
// type defition for a function defining an instance virtual property
export interface PcVirtualGetter<T> extends VirtualGetter<BasePcDocument, T> {}
