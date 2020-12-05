import { advantageWords } from "advWords"
import { DiceOptions } from "dice"
import { capture, concat, fromList, optional, or } from "./regexUtil"

// regex for a whole number
const numRegex = /\d+/i

// regex for optional space
const optionalSpace = /\s*/

// regex for a positive signed number (must contain + sign)
const posNum = (groupName: string) => concat(/\+/, optionalSpace, capture(groupName, numRegex))

// regex for a negative signed number
const negNum = (groupName: string) => concat(/-/, optionalSpace, capture(groupName, numRegex))

// regex for a "d20" format
  // captures the "20" as dieMax group
const soleDieRegex = concat(/d/, optionalSpace, capture("dieMax", numRegex))

// regex for a "5d20" format
  // captures the "5" as dieAmmount group
const diceRegex = concat(optional(capture("dieAmmount", numRegex)), optionalSpace, soleDieRegex)

// regex for a positive or negative bonus
  // ex: " - 5" captures the 5 as a negative bonus
  // ex: "+13"  captures the 13 as a positive bonus
const bonusRegex = or(posNum("posBonus"), negNum("negBonus"))

// // regex for explicit positive advanta (adv +NUMBER)
// const posAdvRegex = concat(fromList(advantageWords), optionalSpace, posNum("posAdv"))

// const boolAdvRegex = fromList(advantageWords)

export const diceRollRegex = concat(diceRegex, optionalSpace, optional(bonusRegex))

// const test = or(boolAdvRegex, posAdvRegex)
// console.log(test)
// console.log(test.exec("  2 d 46 -65   "))

// console.log(concat(multiDiceRegex, optionalSpace, optional(bonusDiceRegex)).exec(" d 12+20")?.groups)
// console.log(concat(multiDiceRegex, optionalSpace, optional(bonusDiceRegex)).exec("25 d 12-8")?.groups)

// export const diceRollRegex = /(?<dieAmmount>\d+)?\s*d\s*(?<dieMax>\d+)\s*(?<bonus>[\+-]\s*\d+)?/i

export const testDiceRoll = (str: string) => {
  return diceRollRegex.test(str)
}

const string2Num = (str: string) => {
  const result = Number(str.trim())
  if (isNaN(result)) throw new Error("Dice.getDiceRoll.string2Num: invalid number string")
  return result
}

type GetDiceRoll = (str: string) => DiceOptions
export const getDiceRoll: GetDiceRoll = (str) => {
  
  const regexGroups = diceRollRegex.exec(str)?.groups ?? {}

  if (!regexGroups) throw new Error("Dice.getDiceRoll: invalid dice roll arguments")

  // get dieMax
  const groups: DiceOptions = {
    dieMax: string2Num(regexGroups.dieMax),
  }

  // set optional arguments, if present
  if (typeof regexGroups.dieAmmount === "string") groups.dieAmmount = string2Num(regexGroups.dieAmmount)
  if (typeof regexGroups.posBonus === "string") groups.bonus = string2Num(regexGroups.posBonus)
  if (typeof regexGroups.negBonus === "string") groups.bonus = -string2Num(regexGroups.negBonus)

  return groups

}

export default getDiceRoll
