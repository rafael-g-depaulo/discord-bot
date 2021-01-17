import DefenseModel from "../../../Models/PcDefense"
import { PcInstanceMethod } from "../types"

export interface updateDefenses {
  (): void,
}

export const updateDefenses: PcInstanceMethod<updateDefenses> = function(this) {
  // save bonus
  const guardBonus = this.guard.bonus
  const dodgeBonus = this.dodge.bonus

  // update defenses
  this.guard = DefenseModel.createGuard(this)
  this.dodge = DefenseModel.createDodge(this)

  // restore bonus
  this.guard.bonus = guardBonus
  this.dodge.bonus = dodgeBonus
}


export default updateDefenses
