import { DiceRollResults } from "./Dice"

const underline = (str: string) => `__${str}__`
const bold = (str: string) => `**${str}**`
const slashed = (str: string) => `~~${str}~~`

export const rollArgsString = (result: DiceRollResults) => {
  // how to represent the arguments for a dice roll
  // ex: 4d8!-7 adv+2
  const { diceArgs } = result

  // "4"
  const dieAmmount = diceArgs.dieAmmount ? `${diceArgs.dieAmmount}` : ""

  // "d8"
  const dieMax = `d${diceArgs.dieMax}`

  // "!"
  const explosion =
    // numeric explosion
    typeof diceArgs.explode === 'number' ? "!".repeat(diceArgs.explode) :
    // boolean positive explosion
    diceArgs.explode ? "!" :
    // no explosion
    ""

  // "-7"
  const bonus =
    // if no bonus, nothing
    !diceArgs.bonus ? "" :
    // if positive bonus
    diceArgs.bonus > 0 ? `+${diceArgs.bonus}` :
    // if negative bonus
    `${diceArgs.bonus}`

  // adv+2
  const advantage =
    // if no advantage
    !diceArgs.advantage ? "" :
    diceArgs.advantage > 0
      ? ` adv+${diceArgs.advantage}`
      : ` dis${diceArgs.advantage}`

  return underline(bold(`${dieAmmount}${dieMax}${explosion}${bonus}${advantage}`))
}

export const rollResultListString = (result: DiceRollResults) => {

  const { rolls, total, diceArgs } = result

  // if only one roll and no bonus or advantage
  if (rolls.length <= 1 && !diceArgs.bonus)
  return `${rolls[0].value}`

  // create the sum of the roll result (just the sum string, without the result)
  const rollsSum = rolls
    .map(({ value, exploded, ignored }) => 
      ignored ? slashed(`${value}`) :
      exploded ? bold(`${value}!`) :
      `${value}`
    )
    .join(" + ")

  // create the bonus part
  const bonusStr =
    !diceArgs.bonus ? "" :
    diceArgs.bonus >= 0 ? ` (+${diceArgs.bonus})` :
    ` (${diceArgs.bonus})`

  // create the roll result (just the end result part)
  const rollSumResult = ` = ${total}`

  return `${rollsSum}${bonusStr}${rollSumResult}`
}

const resultString = (result: DiceRollResults) => {
  return `${rollArgsString(result)}: ${rollResultListString(result)}`
}

export default resultString
