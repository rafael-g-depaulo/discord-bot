import { DiceProps } from "./dice"
import diceRollRegex from "./regex"

export const testDiceRoll = (str: string) => {
  return diceRollRegex.test(str)
}

const string2Num = (str: string) => {
  const result = Number(str.trim())
  if (isNaN(result)) throw new Error("Dice.getDiceRoll.string2Num: invalid number string")
  return result
}

type GetDiceRoll = (str: string) => DiceProps
export const getDiceRoll: GetDiceRoll = (str) => {
  
  const regexGroups = diceRollRegex.exec(str)?.groups ?? {}

  // if (!testDiceRoll(str)) throw new Error("Dice.getDiceRoll: invalid dice roll arguments")
  if (!regexGroups) throw new Error("Dice.getDiceRoll: invalid dice roll arguments")

  // get dieMax
  const groups: DiceProps = {
    dieMax: string2Num(regexGroups.dieMax),
  }

  // set optional arguments, if present
  if (typeof regexGroups.dieAmmount === "string") groups.dieAmmount = string2Num(regexGroups.dieAmmount)
  
  if (typeof regexGroups.posBonus === "string") groups.bonus = string2Num(regexGroups.posBonus)
  if (typeof regexGroups.negBonus === "string") groups.bonus = -string2Num(regexGroups.negBonus)

  if (typeof regexGroups.boolAdv === "string") groups.advantage = 1
  if (typeof regexGroups.boolDis === "string") groups.advantage = -1
  if (typeof regexGroups.posAdv === "string") groups.advantage = string2Num(regexGroups.posAdv)
  if (typeof regexGroups.negAdv === "string") groups.advantage = -string2Num(regexGroups.negAdv)
  if (typeof regexGroups.posDis === "string") groups.advantage = -string2Num(regexGroups.posDis)
  if (typeof regexGroups.negDis === "string") groups.advantage = -string2Num(regexGroups.negDis)

  if (typeof regexGroups.explode === "string") groups.explode = regexGroups.explode.length

  return groups

}

export default getDiceRoll
