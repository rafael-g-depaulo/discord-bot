import { Document, Model, Types } from "mongoose"

export * from "./methods"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export interface Skill {
}

// base document interface
export interface BaseSkillDocument extends Skill, Document<Types.ObjectId> {
}
// unpopulated document (this is what's returned by queries)
export interface SkillDocument extends BaseSkillDocument {}
// populated document
export interface SkillPopulatedDocument extends BaseSkillDocument {}

// interface for model, with all static methods defined
export interface SkillModel extends Model<SkillDocument> {
}
