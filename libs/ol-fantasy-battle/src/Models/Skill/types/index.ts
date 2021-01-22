import { Document, Model, Types } from "mongoose"

import { AttributeName } from "../../../Models/PlayerCharacter"
import { ActionType } from "../../../Utils/actions"

export * from "./methods"

// PC interface for document creation
// this contains the real data typings for the type, but with typescript types and not mongo ones
// relations don't show up here
export type DamageOrHeal = "damage" | "heal" | "none"
export type SkillType = "attribute" | "attack" | "misc"

export interface Skill {
  name: string,
  description: string,
  actionType: ActionType,

  // damage and skill type
  damageOrHeal: DamageOrHeal,
  skillType: SkillType,
  damageType?: string,

  // cost
  hpCost: number,
  mpCost: number,

  // attribute/attack roll (rolled if skillType is "attribute" or "attack")
  attribute?: AttributeName,
  bonus?: number,
  advantage?: number,
  atkRoll?: string,

  // damage roll options
  dmgAttribute?: AttributeName,
  dmgAttributeBonus?: number,
  dmgAdvantage?: number,
  dmgExplosion?: number,
  dmgRoll?: string,
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
