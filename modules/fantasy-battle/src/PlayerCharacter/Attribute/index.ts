import { DiceRollResults, createDice, Dice } from "@discord-bot/dice"

interface AttbState {
  value: number,
  bonus: number,
  total: number,
}
export interface Attribute {
  value: number,
  bonus: number,
  total: number,
  rollAttribute: () => DiceRollResults,
  rollDmg: () => DiceRollResults,
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

export const createAttribute = (): Attribute => {

  const state: AttbState = {
    value: 0,
    bonus: 0,
    get total() { return state.bonus + state.value },
  }

  return ({
    ...state,
    rollAttribute: () => createDice({ dieMax: 20, bonus: 2 * (state.total) }).detailedRoll(),
    rollDmg: () => createDice({ dieMax: 20, bonus: 2 * (state.total) }).detailedRoll(),
  })
}

export const createAttributes = (): Attributes => Object
  .fromEntries(AttributeNames
    .map(attName => [attName, createAttribute()])
  ) as Attributes
