import { DiceState, DieRollResult, DiceRollResults } from "./index"

const ArrayOfSize = (n: number) => Array(n - n % 1).fill(null)

interface TempDieRollResult extends DieRollResult {
  i: number,
}

// roll a single die
const detailedDieRoll: (state: DiceState) => DieRollResult = state => ({ value: state.die.roll() })

// make a dice roll, and detail every step
const detailedRoll: (state: DiceState) => DiceRollResults = (state) => {
  const { dieMax, dieAmmount, advantage, explode, bonus } = state.args

  // create rolls
  let tempRolls: TempDieRollResult[] = ArrayOfSize(dieAmmount + Math.abs(advantage))
    .map(() => (detailedDieRoll(state)))
    .map((roll, i) => ({ ...roll, i }))

  // if there is advantage or disadvantage, ignore the lower/higher rolls, respectively
  if (advantage !== 0) tempRolls
    // make a shallow copy of the array
    .slice()
    // sort them
    .sort((a, b) => a.value === b.value
      // if a and b are the same, use the one closest to the start
      ? b.i - a.i
      // ? a.i - b.i
      // else, sort according to advantage
      : advantage > 0
        ? b.value - a.value
        : a.value - b.value
    )
    // remove the higher/lower rolls
    .forEach((roll, i) => (i >= dieAmmount) && (roll.ignored = true))

  // if there is explosion, explode the dice
  if (explode !== false) tempRolls = tempRolls
    .flatMap((roll) => {
      // if roll should be ignored because of disadvantage, don't explode it
      if (roll.ignored) return roll

      // array of rolls
      const rollArr = [roll]

      // minimum roll required for die explosion
      const explosionRange = explode === true
        ? dieMax
        : dieMax - explode + 1

      // while the last roll exploded, roll another dice and check again
      while (rollArr[rollArr.length-1].value >= explosionRange) {
        rollArr[rollArr.length-1].exploded = true
        rollArr.push({ ...detailedDieRoll(state), i: rollArr.length })
      }
      
      // return array of rolls
      return rollArr
    })
    
  // remove index from tempRolls
  const rolls: DieRollResult[] = tempRolls
    .map(({ i, ...roll}) => roll)

  // calculate total dice roll (with bonus)
  const total = rolls.reduce((acc, cur) => cur.ignored ? acc : acc + cur.value, bonus)

  return {
    rolls,
    total,
    diceArgs: state.args,
  }
}

export default detailedRoll
