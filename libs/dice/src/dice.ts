// Dice represents a possible dice roll configuration.
// a dice roll configuration may have bonuses, advantage/disadvantage (rolling many times and taking the better/worse one), die explosion, etc.
// the same dice roll configuration may be rolled many times
// a dice roll is composed of only one kind of dice
//! (this may be changed in the future if it makes sense. if this is ever change, remove this fucking comment please)

import { RandFn } from "./index"
import createDie, { Die } from "./die"

const ArrayOfSize = n => Array(n).fill(null)

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

  // basic roll adding the bonus
  const baseRoll = () => ArrayOfSize(dieAmmount)
    .map(() => state.die.roll())  // roll "dieAmmount" dies
    .reduce((acc, cur) => acc + cur, bonus) // then sum it all, and add the bonus

  // roll, using advantage and stuff
  const roll = () => {
    
    // base roll
    let rollResult = baseRoll()
    // deal with (dis)advantage, if it exists
    let adv = advantage
    while (adv !== 0) {
      if (adv > 0) {
        rollResult = Math.max(rollResult, baseRoll())
        adv--
      }
      if (adv < 0) {
        rollResult = Math.min(rollResult, baseRoll())
        adv++
      }
    }

    return rollResult
  }

  return {
    roll,
  }
}

export default createDice
