// Dice represents a possible dice roll configuration.
// a dice roll configuration may have bonuses, advantage/disadvantage (rolling many times and taking the better/worse one), die explosion, etc.
// the same dice roll configuration may be rolled many times
// a dice roll is composed of only one kind of dice
//! (this may be changed in the future if it makes sense. if this is ever change, remove this fucking comment please)

import { RandFn } from "./index"
import createDie, { Die } from "./die"

const ArrayOfSize = (n: number) => Array(n - n % 1).fill(null)

export interface DiceOptions {
  randomFn?: RandFn,
  dieMax: number,
  bonus?: number,
  advantage?: number,
  dieAmmount?: number,
  explode?: boolean | number,
}

interface DiceState {
  die: Die
}

export interface Dice {
  roll: () => number,
}

type CreateDice = (props: DiceOptions) => Dice
export const createDice: CreateDice = (props) => {
  
  const {
    randomFn = Math.random,
    dieMax,
    bonus = 0,
    advantage = 0,
    dieAmmount = 1,
    explode = false,
  } = props

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
  const roll = () => {
    
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

  return {
    roll,
  }
}

export default createDice
