// a Die represents a single dice, that can be rolled multiple times.
// dieMax represents the dice type (d6, d8, d20, etc.)
// each roll is a different roll of the die

import { RandFn } from "index"

export interface DieOptions {
  randomFn?: RandFn,
  dieMax: number,
}

export interface Die {
  roll: () => number
}

type CreateDie = (props: DieOptions) => Die
export const createDie: CreateDie = (props) => {
  const {
    randomFn = Math.random,
    dieMax,
  } = props

  const roll = () => {
    let randNum = randomFn()
    randNum = Math.max(0, randNum) // don't allow numbers below 0
    randNum = Math.min(1, randNum) // don't allow numbers above 1

    const rollResult = randNum === 0
      ? 1
      : Math.ceil(randNum * dieMax)

    return rollResult
  }

  return {
    roll,
  }
}

export default createDie
