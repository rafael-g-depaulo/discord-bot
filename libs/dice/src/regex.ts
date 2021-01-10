import { capture, concat, fromList, optional, or, negNum, posNum, signedInteger } from "@discord-bot/regex"
import { advantageWords, disadvantageWords } from "./advWords"

// regex for a whole number
const number = /\d+/

// regex for optional space
const optionalSpace = /\s*/

// regex for a "d20" format
  // captures the "20" as dieMax group
export const die = concat(/d/i, optionalSpace, capture("dieMax", number))

// regex for a "5d20" format
  // captures the "5" as dieAmmount group
export const dice = concat(optional(capture("dieAmmount", number)), optionalSpace, die)

// captures the ! for a dice explosion
const explosion = capture("explode", /!+/)

const bonus = signedInteger("posBonus", "negBonus")

// regex for explicit (dis)advantage (adv +NUMBER)
const posAdv = concat(fromList(advantageWords, "i"), optionalSpace, posNum("posAdv"))
const negAdv = concat(fromList(advantageWords, "i"), optionalSpace, negNum("negAdv"))
const posDis = concat(fromList(disadvantageWords, "i"), optionalSpace, posNum("posDis"))
const negDis = concat(fromList(disadvantageWords, "i"), optionalSpace, negNum("negDis"))

// regex for boolean advantage (adv) (this is equivalent to adv+1)
const boolAdv = capture("boolAdv", fromList(advantageWords, "i"))
const boolDis = capture("boolDis", fromList(disadvantageWords, "i"))

// regex for any kind of advantage
const adv = or(posAdv, negAdv, posDis, negDis, boolDis, boolAdv)

export const diceArgs = concat(optionalSpace, optional(explosion), optionalSpace, optional(bonus), optionalSpace, optional(adv))

// final regex for checking if something is a dice roll
export const diceRoll = concat(dice, optionalSpace, optional(explosion), optionalSpace, optional(bonus), optionalSpace, optional(adv))

export default diceRoll
