import { createDice, Dice, DiceRollResults } from "@discord-bot/dice"
import { PcInstanceMethod, AttributeName } from "../types"

export interface rollAttribute {
  (attbName: AttributeName, bonus?: number): DiceRollResults,
}

// cache dice
const diceCache = new Map<number, Dice>()
const useCache = (key: number, diceGenerator: () => Dice) => {
  if (!diceCache.has(key))
    diceCache.set(key, diceGenerator())
  return diceCache.get(key)!
}

// get correct dice to roll for attribute value
const getAttributeDice = (value: number) => {
  return useCache(value, () => createDice({ dieMax: 20, bonus: 2 * value }))
}

export const rollAttribute: PcInstanceMethod<rollAttribute> = function(this, attbName, bonus = 0) {
  const attributeValue = this.attributes[attbName].value + this.attributes[attbName].bonus
  return getAttributeDice(attributeValue + bonus).detailedRoll()
}

export default rollAttribute
