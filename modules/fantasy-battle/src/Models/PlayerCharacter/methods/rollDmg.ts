import { createDice, Dice, DiceExtraArgs, DiceProps, DiceRollResults } from "@discord-bot/dice"
import { getDmgDiceArg } from "../helpers/dmgDice"
import { PcInstanceMethod, AttributeName } from "../types"

export interface rollDmg {
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
const getAttributeDice = (dmgValue: number, args: DiceExtraArgs) => {
  // create diceArgs and add user overrides (advantage, bonus, explosion)
  const diceArgs: DiceProps = { ...getDmgDiceArg(dmgValue), ...args }
  return useCache(JSON.stringify(diceArgs), () => createDice(diceArgs))
}

export const rollDmg: PcInstanceMethod<rollDmg> = function(this, attbName, rollArgs) {
  const {
    bonus = 0,
    advantage = 0,
  } = rollArgs ?? {}

  const explode = Math.max(Number(rollArgs?.explode), 1)

  const attributeValue = this.attributes[attbName].value + this.attributes[attbName].bonus
  return getAttributeDice(attributeValue + bonus, { advantage, explode }).detailedRoll()
}

export default rollDmg
