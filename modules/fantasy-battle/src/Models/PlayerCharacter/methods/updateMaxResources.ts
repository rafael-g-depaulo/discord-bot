import ResourceModel from "../../../Models/PcResource"
import { PcInstanceMethod } from "../types"

export interface updateMaxResources {
  (): void,
}


export const updateMaxResources: PcInstanceMethod<updateMaxResources> = function(this) {
  const { current: currentHp, temporary: temporaryHp } = this.hp
  const { current: currentMp, temporary: temporaryMp } = this.mp

  // update max hp/mp
  this.hp = ResourceModel.createHp(this)
  this.mp = ResourceModel.createMp(this)

  // restore current values, using the new maximum if the current would go above the max
  this.hp.current = Math.min(currentHp, this.hp.current)
  this.mp.current = Math.min(currentMp, this.mp.current)

  // restore temporary hp/mp
  this.hp.temporary = temporaryHp
  this.mp.temporary = temporaryMp
}

export default updateMaxResources
