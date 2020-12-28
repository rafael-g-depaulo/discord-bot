import { Document, Model } from "mongoose"

// make sure that the schema fields have at least all of the fields from the original data type (but it can have more, because of things)
export type SchemaFields<T> = Record<keyof T, any>
// export type SchemaFields<T> = Record<keyof T, any> & { [key: string]: any }

// type for relational fields in the original data type
// if unpopulated document, then it's of T["_id"] type
// if populated document, it's an actual T instance
export type Relation<T extends Document> = T["_id"] | T

// type defition for instance method
export interface InstanceMethod<D extends Document, Method extends (...args: any) => any> {
  (this: D, ...args: Parameters<Method>): ReturnType<Method>
}

export interface StaticMethod<D extends Document, M extends Model<D>, Method extends (...args: any) => any> {
  (this: M, ...args: Parameters<Method>): ReturnType<Method>
}

// type defition for a function defining an instance virtual property
export interface VirtualGetter<Entity extends Document, T> {
  (this: Entity): T
}
