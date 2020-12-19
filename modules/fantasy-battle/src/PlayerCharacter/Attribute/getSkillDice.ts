import { createDice, Dice } from "@discord-bot/dice"

export const getSkillDice = (attb: number): Dice => {
  const attbValue = attb - attb % 1
  return createDice({ dieMax: 20, bonus: 2 * attbValue })
}

export default getSkillDice
