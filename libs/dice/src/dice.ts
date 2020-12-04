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
  } = props

  const state: DiceState = {
    die: createDie({ dieMax, randomFn })
  }

  // roll, using advantage and stuff
  const roll = () => {
    
    // roll an ammount of dice equal to the final ammount plus the absolute ammount of (dis)advantage
    return ArrayOfSize(dieAmmount + Math.abs(advantage))
      .map(() => state.die.roll())
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
