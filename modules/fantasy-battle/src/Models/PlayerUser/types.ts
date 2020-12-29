import { InstanceMethod, StaticMethod, VirtualGetter } from "../helpers"
import { Document, Model, Types } from "mongoose"

import { PcDocument } from "../PlayerCharacter"

// PlayerUser interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface PlayerUser {
  // user's discord id
  userId: string,
  // user's discord username
  username: string,
  // user's characters
  characters: PcDocument[],
}

// base document interface
interface BasePlayerUserDocument extends PlayerUser, Document<Types.ObjectId> {}
// unpopulated document (this is what's returned by queries)
export interface PlayerUserDocument extends BasePlayerUserDocument {}
// populated document
export interface PlayerUserPopulatedDocument extends BasePlayerUserDocument {}


// interface for model, with all static methods defined
import { getUser } from "./statics/getUser"
import { create } from "./statics/create"
export interface PlayerUserModel extends Model<PlayerUserDocument> {
  getUser: getUser,
  createUser: create,
}


// type defition for instance method
export interface PlayerUserInstanceMethod<M extends (...args: any) => any> extends InstanceMethod<BasePlayerUserDocument, M> {}
// type defition for instance method
export interface PlayerUserStaticMethod<M extends (...args: any) => any> extends StaticMethod<PlayerUserDocument, PlayerUserModel, M> {}
// type defition for a function defining an instance virtual property
export interface PlayerUserVirtualGetter<T> extends VirtualGetter<BasePlayerUserDocument, T> {}
