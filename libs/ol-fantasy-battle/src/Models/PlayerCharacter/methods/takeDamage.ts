import { PcInstanceMethod } from "../types"

export interface takeDamage {
  (damage: number): number,
}

// does the damage calculation (never return something below 0, this would heal a character)
const reduceDamage = (damage: number, guard: number, dodge: number) => {
  const posDodge = Math.max(dodge, 0)
  const posGuard = Math.max(guard, 0)

  const afterDodge = Math.ceil(damage * (15 / (posDodge + 15)))
  const afterGuard = afterDodge - posGuard

  return Math.max(afterGuard, 0)
}

export const takeDamage: PcInstanceMethod<takeDamage> = function(this, damage) {

  const reducedDamage = reduceDamage(damage, this.guard.total, this.dodge.total)

  // if there is temporary hp, remove as much as possible from it before taking from normal HP
  const damageTakenFromTemp = this.hp.temporary > 0
    ? Math.min(this.hp.temporary, reducedDamage)
    : 0
  this.hp.temporary -= damageTakenFromTemp

  // remove the rest of the damage from current hp
  this.hp.current -= reducedDamage - damageTakenFromTemp

  return reducedDamage
}

export default takeDamage
