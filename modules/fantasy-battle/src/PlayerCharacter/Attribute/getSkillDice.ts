import { createDice, Dice } from "@discord-bot/dice"
import { Attribute } from "./index"

export const getSkillDice = (attb: Attribute): Dice => {
  const attbValue = attb.value + attb.bonus
  return createDice({ dieMax: 20, bonus: 2 * attbValue })
}

export default getSkillDice
