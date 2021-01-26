import { ActionType } from "../../../Utils/actions"
import { AttributeName } from "../../../Models/PlayerCharacter"
import SkillModel, { Skill, SkillDocument } from ".."
import { SkillStaticMethod, SkillType, DamageOrHeal } from "../types"

export interface createSkillProps {
  name: string,
  description: string,
  actionType?: ActionType,

  // damage and skill type
  damageOrHeal?: DamageOrHeal,
  skillType?: SkillType,
  damageType?: string,

  // cost
  hpCost?: number,
  mpCost?: number,

  // attribute/attack roll (rolled if skillType is "attribute" or "attack")
  attribute?: AttributeName,
  bonus?: number,
  advantage?: number,

  // damage roll options
  dmgAttribute?: AttributeName,
  dmgAttributeBonus?: number,
  dmgAdvantage?: number,
  dmgExplosion?: number,
}

export interface create {
  (props: createSkillProps): SkillDocument,
}

const create: SkillStaticMethod<create> = function(this, props) {
  const {
    name,
    description,
    actionType = "major",
    
    hpCost = 0,
    mpCost = 0,
    
    attribute,
    bonus,
    advantage,
    
    damageType,
    dmgAttribute,
    dmgAttributeBonus,
    dmgAdvantage,
    dmgExplosion,
    
  } = props
  
  const damageOrHeal = !dmgAttribute ? "none" : props.damageOrHeal ?? "damage"
  const skillType = !attribute ? "misc" : props.skillType ??  "attack"

  // base props that all skill should have
  const baseProps = {
    name,
    description,
    actionType,
    hpCost,
    mpCost,
    skillType,
    damageOrHeal,
  }

  // props for the attribute/attack roll
  const rollProps = !!attribute
    ? { attribute, bonus, advantage }
    : {}

  const dmgProps = !!dmgAttribute
    ? { damageType, dmgAttribute, dmgAttributeBonus, dmgAdvantage, dmgExplosion }
    : {}

  const skill = new SkillModel({ ...baseProps, ...rollProps, ...dmgProps })
  return skill
}

export default create
