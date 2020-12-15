// Dice represents a possible dice roll configuration.
// a dice roll configuration may have bonuses, advantage/disadvantage (rolling many times and taking the better/worse one), die explosion, etc.
// the same dice roll configuration may be rolled many times
// a dice roll is composed of only one kind of dice
//! (this may be changed in the future if it makes sense. if this is ever change, remove this fucking comment please)

// Dice.roll simply rolls the dice and returns the result, while Dice.detailedRoll returns the result of all
// individual die rolls, and a bunch of other details

import { RandFn } from "./utils"
import createDie, { Die } from "./die"

const ArrayOfSize = (n: number) => Array(n - n % 1).fill(null)

export interface DiceProps {
  randomFn?: RandFn,
  dieMax: number,
  bonus?: number,
  advantage?: number,
  dieAmmount?: number,
  explode?: boolean | number,
}

interface DieRollResult {
  value: number,      // the value of the die roll
  ignored?: boolean,  // wether or not the roll should be ignored because of advantage or disadvantage
  exploded?: boolean, // wether or not the roll has exploded
}

interface TempDieRollResult extends DieRollResult {
  i: number,
}
export interface DiceRollResults {
  rolls: DieRollResult[],
  bonus: number,
  total: number,
}
export interface Dice {
  roll: () => number,
  detailedRoll: () => DiceRollResults,
  props: DiceProps,
}

interface DiceState {
  die: Die
}

type CreateDice = (props: DiceProps) => Dice
const createDice: CreateDice = (props) => {
  
  const {
    randomFn = Math.random,
    dieMax,
    bonus = 0,
    advantage = 0,
    dieAmmount = 1,
    explode: explodeProp = false,
  } = props

  // if explode is a number above dieMax, make it 1 under dieMax to avoid infinite loops
  const explode = typeof explodeProp !== "string" ? explodeProp : Math.min(explodeProp, dieMax-1)

  // throw if props are invalid
  if (typeof explode === 'number' && explode < 0) throw new Error(`Dice: "explode" prop must be undefined, boolean, 0 or positive integer!`)
  if (dieAmmount <= 0) throw new Error(`Dice: "dieAmmount" prop must be a positive integer above 0!`)

  const state: DiceState = {
    die: createDie({ dieMax, randomFn })
  }

  // roll die and explode if needed
  const rollAndExplode: () => number = () => {
    const rollResult = state.die.roll()

    // if no explosion, return roll
    if (explode === false) return rollResult

    // if simple explosion, explode and return if dieMax reached
    if (explode === true)
    return rollResult === dieMax
      ? rollResult + rollAndExplode()
      : rollResult

    // if explode is a number
    return rollResult >= dieMax - explode
      ? rollResult + rollAndExplode()
      : rollResult
  }

  // roll, using advantage and stuff
  const roll: () => number = () => {
    
    // roll an ammount of dice equal to the final ammount plus the absolute ammount of (dis)advantage
    return ArrayOfSize(dieAmmount + Math.abs(advantage))
      .map(() => rollAndExplode())
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

  const detailedDieRoll: () => DieRollResult = () => ({ value: state.die.roll() })
  const detailedRoll: () => DiceRollResults = () => {

    // create rolls
    let tempRolls: TempDieRollResult[] = ArrayOfSize(dieAmmount + Math.abs(advantage))
      .map(() => (detailedDieRoll()))
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
          rollArr.push({ ...detailedDieRoll(), i: rollArr.length })
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
      bonus,
      total,
    }
  }

  return {
    roll,
    detailedRoll,
    props: {...props},
  }
}

export default createDice
