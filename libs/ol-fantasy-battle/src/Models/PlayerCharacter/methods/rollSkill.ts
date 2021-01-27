import { createDice, Dice, DiceArgs, DiceExtraArgs, DiceProps, DiceRollResults } from "@discord-bot/dice"
import { SkillDocument } from "Models/Skill"
import { getDmgDiceArg } from "../helpers/dmgDice"
import { PcInstanceMethod, AttributeName } from "../types"
import { getAtkArgs } from "./rollAtk"
import { getAttbArgs } from "./rollAttribute"

export interface rollSkill {
  (skillIndex: number, rollArgs?: DiceExtraArgs, dmgArgs?: DiceExtraArgs):
    { skill: SkillDocument, roll: DiceRollResults | null, dmg: DiceRollResults | null } | null,
}

const rollDice = (args: DiceArgs) => createDice(args).detailedRoll()

export const rollSkill: PcInstanceMethod<rollSkill> = function(this, skillIndex, rollArgs, dmgArgs) {
  const i = Math.floor(skillIndex)
  if (i < 0 || i >= this.skills.length) return null

  const skill = this.skills[i]

  // if there is a bonus to the roll attribute, apply it temporarily
  if (skill.attribute && skill.bonus) this.attributes[skill.attribute].bonus += skill.bonus
  const roll =
    skill.skillType === "attack"    && skill.attribute ? rollDice(getAtkArgs(this, skill.attribute, rollArgs))  :
    skill.skillType === "attribute" && skill.attribute ? rollDice(getAttbArgs(this, skill.attribute, rollArgs)) : null
  if (skill.attribute && skill.bonus) this.attributes[skill.attribute].bonus -= skill.bonus

  let dmg = null
  if (skill.damageOrHeal !== "none" && skill.dmgAttribute) {
    // if there is a bonus to the damage attribute, apply it temporarily
    if (skill.dmgAttributeBonus) {
      this.attributes[skill.dmgAttribute].bonus += skill.dmgAttributeBonus
    }

    const attbValue = this.attributes[skill.dmgAttribute].value + this.attributes[skill.dmgAttribute].bonus
    const dmgDiceProps: DiceArgs = getDmgDiceArg(attbValue)
    // dmgDiceProps.
    if (skill.dmgAdvantage) dmgDiceProps.advantage = skill.dmgAdvantage
    if (skill.dmgExplosion && skill.dmgExplosion > 0) dmgDiceProps.explode = skill.dmgExplosion
    dmg = rollDice(dmgDiceProps)

    if (skill.dmgAttributeBonus) {
      this.attributes[skill.dmgAttribute].bonus -= skill.dmgAttributeBonus
    }
  }
  
  return { skill, roll, dmg }
}

export default rollSkill
