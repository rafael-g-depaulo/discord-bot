import { DiceRollResults, createDice, Dice } from "@discord-bot/dice"
import logger from "Utils/logger"
import getDamageDice from "./getDamageDice"
import getSkillDice from "./getSkillDice"

interface AttbState {
  value: number,
  bonus: number,
  total: number,
  dmgDice: { dice: Dice, cacheKey: any },
  skillDice: { dice: Dice, cacheKey: any },
}

export interface AttributeProperties {
  value: number,
  bonus: number,
}
export interface Attribute extends AttributeProperties {
  total: number,
  rollAttribute: () => DiceRollResults,
  rollDmg: () => DiceRollResults,
}

export type AttribuesProperties = {
  [key in AttributeNames]: AttributeProperties
}
export type Attributes = {
  [key in AttributeNames]: Attribute
}

export type AttributeNames =
  "Agility"    | "Fortitude"  | "Might"      | "Learning"  |
  "Logic"      | "Perception" | "Will"       | "Deception" |
  "Persuasion" | "Presence"   | "Alteration" | "Creation"  |
  "Energy"     | "Entropy"    | "Influence"  | "Movement"  |
  "Prescience" | "Protection"

export const AttributeNames: AttributeNames[] = [
  "Agility"    , "Fortitude"  , "Might"      , "Learning"  ,
  "Logic"      , "Perception" , "Will"       , "Deception" ,
  "Persuasion" , "Presence"   , "Alteration" , "Creation"  ,
  "Energy"     , "Entropy"    , "Influence"  , "Movement"  ,
  "Prescience" , "Protection" ,
]

export const createAttribute = ({ value = 0, bonus = 0 } = {}): Attribute => {

  const state: AttbState = {
    value,
    bonus,
    get total() { return state.bonus + state.value },
    dmgDice: { dice: getDamageDice(value + bonus), cacheKey: value + bonus },
    skillDice: { dice: getSkillDice(value + bonus), cacheKey: value + bonus },
  }

  // methods
  // roll skill check for attribute
  const rollAttribute = (): DiceRollResults => {
    // update dice cache, if needed
    if (state.total !== state.skillDice.cacheKey) state.skillDice = {
      cacheKey: state.total,
      dice: getSkillDice(state.total)
    }
    return state.skillDice.dice.detailedRoll()
  }
  
  // roll dmg for attribute
  const rollDmg = (): DiceRollResults => {
    // update dice cache, if needed
    if (state.total !== state.dmgDice.cacheKey) state.dmgDice = {
      cacheKey: state.total,
      dice: getDamageDice(state.total)
    }
    return state.dmgDice.dice.detailedRoll()
  }

  return ({
    // value
    get value()  { return state.value },
    set value(v) { state.value = v },

    // bonus
    get bonus()  { return state.bonus },
    set bonus(v) { state.bonus = v },
    
    // total
    get total()  { return state.total },

    // methods
    rollAttribute,
    rollDmg,
  })
}

export const createAttributes = (attbList?: AttribuesProperties): Attributes => Object
  .fromEntries(AttributeNames
    .map(attName => [attName, createAttribute(attbList && attbList[attName])])
  ) as Attributes
