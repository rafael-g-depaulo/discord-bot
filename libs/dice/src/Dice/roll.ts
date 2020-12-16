import { DiceState } from "./index"

const ArrayOfSize = (n: number) => Array(n - n % 1).fill(null)

// roll die and explode if needed
const rollAndExplode: (state: DiceState) => number = (state) => {
  const rollResult = state.die.roll()
  const { explode, dieMax } = state.args

  // if no explosion, return roll
  if (explode === false) return rollResult

  // if simple explosion, explode and return if dieMax reached
  if (explode === true)
  return rollResult === dieMax
    ? rollResult + rollAndExplode(state)
    : rollResult

  // if explode is a number
  return rollResult >= dieMax - explode
    ? rollResult + rollAndExplode(state)
    : rollResult
}

// roll, using advantage and stuff
const roll: (state: DiceState) => number = (state) => {
  const { advantage, dieAmmount, bonus } = state.args

  // roll an ammount of dice equal to the final ammount plus the absolute ammount of (dis)advantage
  return ArrayOfSize(dieAmmount + Math.abs(advantage))
    .map(() => rollAndExplode(state))
    // if has disadvantage sort acending
    // if has advantage sort descending
    // if there isnt (dis)advantage, this doesn't matter
    .sort((a, b) => advantage >= 0 ? b-a : a-b)
    // if there is advantage, only keep the dieAmmount highest rolls
    // if there is disadvantage, only keep the dieAmmount lowest rolls
    // if there isnt (dis)advantage, this doesn't matter
    .filter((_, i) => i < dieAmmount)
    // then sum it all, and add the bonus
    .reduce((acc, cur) => acc + cur, bonus)
}

export default roll
