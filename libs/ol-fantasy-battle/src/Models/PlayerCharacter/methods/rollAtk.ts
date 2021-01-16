import { createDice, Dice, DiceArgs, DiceExtraArgs, DiceRollResults } from "@discord-bot/dice"
import { AttributeName, PcInstanceMethod } from "../types"


export interface rollAtk {
  (attbName: AttributeName, rollArgs?: DiceExtraArgs): DiceRollResults,
}

// cache dice
const diceCache = new Map<string, Dice>()
const useCache = (key: string, diceGenerator: () => Dice) => {
  if (!diceCache.has(key))
    diceCache.set(key, diceGenerator())
  return diceCache.get(key)!
}

// get correct dice to roll for attribute value
const getAttributeDice = (args: DiceArgs) => {
  return useCache(JSON.stringify(args), () => createDice(args))
}

export const rollAtk: PcInstanceMethod<rollAtk> = function(this, attbName, rollArgs) {
  const {
    bonus = 0,
    advantage = 0,
  } = rollArgs ?? {}

  const attributeValue = this.attributes[attbName].value + this.attributes[attbName].bonus

  return getAttributeDice({
    bonus: attributeValue + bonus,
    dieMax: 20,
    advantage,
    dieAmmount: 1,
  }).detailedRoll()
}

export default rollAtk
