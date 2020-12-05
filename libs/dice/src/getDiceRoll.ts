import { advantageWords, disadvantageWords } from "./advWords"
import { DiceOptions } from "./dice"
import { capture, concat, fromList, optional, or } from "./regexUtil"

// regex for a whole number
const numRegex = /\d+/

// regex for optional space
const optionalSpace = /\s*/

// regex for a positive signed number (must contain + sign)
const posNum = (groupName: string) => concat(/\+/, optionalSpace, capture(groupName, numRegex))

// regex for a negative signed number
const negNum = (groupName: string) => concat(/-/, optionalSpace, capture(groupName, numRegex))

// regex for a "d20" format
  // captures the "20" as dieMax group
const soleDieRegex = concat(/d/i, optionalSpace, capture("dieMax", numRegex))

// regex for a "5d20" format
  // captures the "5" as dieAmmount group
const diceRegex = concat(optional(capture("dieAmmount", numRegex)), optionalSpace, soleDieRegex)

// captures the ! for a dice explosion
const explosionRegex = capture("explode", /!+/)

// regex for a positive or negative bonus
  // ex: " - 5" captures the 5 as a negative bonus
  // ex: "+13"  captures the 13 as a positive bonus
const bonusRegex = or(posNum("posBonus"), negNum("negBonus"))

// regex for explicit (dis)advantage (adv +NUMBER)
const posAdvRegex = concat(fromList(advantageWords, "i"), optionalSpace, posNum("posAdv"))
const negAdvRegex = concat(fromList(advantageWords, "i"), optionalSpace, negNum("negAdv"))
const posDisRegex = concat(fromList(disadvantageWords, "i"), optionalSpace, posNum("posDis"))
const negDisRegex = concat(fromList(disadvantageWords, "i"), optionalSpace, negNum("negDis"))

// regex for boolean advantage (adv) (this is equivalent to adv+1)
const boolAdvRegex = capture("boolAdv", fromList(advantageWords, "i"))
const boolDisRegex = capture("boolDis", fromList(disadvantageWords, "i"))

// regex for any kind of advantage
const advRegex = or(posAdvRegex, negAdvRegex, posDisRegex, negDisRegex, boolDisRegex, boolAdvRegex)

// final regex for checking if something is a dice roll
export const diceRollRegex = concat(diceRegex, optionalSpace, optional(explosionRegex), optionalSpace, optional(bonusRegex), optionalSpace, optional(advRegex))

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

  // if (!testDiceRoll(str)) throw new Error("Dice.getDiceRoll: invalid dice roll arguments")
  if (!regexGroups) throw new Error("Dice.getDiceRoll: invalid dice roll arguments")

  // get dieMax
  const groups: DiceOptions = {
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
