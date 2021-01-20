import { createDice } from "@discord-bot/dice"
import { getDmgDiceArg } from "../helpers"
import { PcInstanceMethod } from "../types"
import { Recovered } from "../types/Rest"

export interface shortRest {
  (): Recovered,
}

export const shortRest: PcInstanceMethod<shortRest> = function(this) {
  // const hpDiceProps = getDmgDiceArg(this.attributes[this.hpDiceAttb].value)
  const mpDiceProps = getDmgDiceArg(this.attributes[this.mpDiceAttb].value)

  // const rolledHp = createDice(hpDiceProps).detailedRoll().total
  const rolledMp = createDice(mpDiceProps).detailedRoll().total

  // const recoveredHp = Math.floor(0.25 * rolledHp)
  const recoveredMp = Math.floor(0.25 * rolledMp)

  // this.hp.current = this.hp.current + recoveredHp
  this.mp.current = this.mp.current + recoveredMp

  // const overhealedHp = Math.max(0, this.hp.current - this.hp.max)
  // this.hp.current -= overhealedHp
  const overhealedMp = Math.max(0, this.mp.current - this.mp.max)
  this.mp.current -= overhealedMp

  return {
    hp: 0,
    mp: recoveredMp - overhealedMp,
  }
}

export default shortRest
