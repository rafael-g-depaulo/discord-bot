import { createDice, Dice, DiceArgs, DiceExtraArgs, DiceRollResults } from "@discord-bot/dice"
import { PcInstanceMethod } from "../types"

export interface rollInitiative {
  (rollArgs?: DiceExtraArgs): DiceRollResults,
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

export const rollInitiative: PcInstanceMethod<rollInitiative> = function(this, rollArgs) {
  const {
    bonus = 0,
    advantage = 0,
    explode = 0,
  } = rollArgs ?? {}

  const agiTotal = this.attributes.Agility.bonus + this.attributes.Agility.value

  return getAttributeDice({
    bonus: agiTotal + bonus,
    dieMax: 20,
    advantage,
    dieAmmount: 1,
    explode,
  }).detailedRoll()
}

export default rollInitiative
