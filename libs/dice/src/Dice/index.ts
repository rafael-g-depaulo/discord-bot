// Dice represents a possible dice roll configuration.
// a dice roll configuration may have bonuses, advantage/disadvantage (rolling many times and taking the better/worse one), die explosion, etc.
// the same dice roll configuration may be rolled many times
// a dice roll is composed of only one kind of dice
//! (this may be changed in the future if it makes sense. if this is ever change, remove this fucking comment please)

// Dice.roll simply rolls the dice and returns the result, while Dice.detailedRoll returns the result of all
// individual die rolls, and a bunch of other details

import { RandFn } from "../utils"
import createDie, { Die } from "../die"

import rollDice from "./roll"
import detailedRoll from "./detailedRoll"

export interface DiceProps {
  randomFn?: RandFn,
  dieMax: number,
  bonus?: number,
  advantage?: number,
  dieAmmount?: number,
  explode?: boolean | number,
}

// generic to remove property from type
type Without<T, K> = Pick<T, Exclude<keyof T, K>>
// type to be returned by dice.args and dice.detailedRoll().diceArgs
export interface DiceArgs extends Without<DiceProps, "randomFn"> {}

export interface DieRollResult {
  value: number,      // the value of the die roll
  ignored?: boolean,  // wether or not the roll should be ignored because of advantage or disadvantage
  exploded?: boolean, // wether or not the roll has exploded
}

export interface DiceRollResults {
  rolls: DieRollResult[],
  total: number,
  diceArgs: DiceArgs,
}
export interface Dice {
  roll: () => number,
  detailedRoll: () => DiceRollResults,
  args: DiceArgs,
}

export interface DiceState {
  die: Die,
  args: Required<DiceArgs>,
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
  const explode = typeof explodeProp !== "number" ? explodeProp : Math.min(explodeProp, dieMax-1)

  const state: DiceState = {
    // the die object to roll
    die: createDie({ dieMax, randomFn }),
    // a new props object with all of the optional properties filled with their default values
    args: {
      dieMax,
      dieAmmount,
      bonus,
      advantage,
      explode,
    },
  }

  // throw if props are invalid
  if (typeof explode === 'number' && explode < 0) throw new Error(`Dice: "explode" prop must be undefined, boolean, 0 or positive integer!`)
  if (dieAmmount <= 0) throw new Error(`Dice: "dieAmmount" prop must be a positive integer above 0!`)

  return {
    roll: () => rollDice(state),
    detailedRoll: () => detailedRoll(state),
    args: state.args,
  }
}

export default createDice
