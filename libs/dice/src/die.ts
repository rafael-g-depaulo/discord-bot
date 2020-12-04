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

    const rollResult = randNum * dieMax === dieMax
      ? dieMax
      : Math.floor(randNum * dieMax) + 1

    return rollResult
  }

  return {
    roll,
  }
}
