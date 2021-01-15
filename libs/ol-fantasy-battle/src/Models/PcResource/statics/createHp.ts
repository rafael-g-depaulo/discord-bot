import ResourceModel, { Resource, ResourceDocument } from ".."
import { ResourceStaticMethod } from "../types"
import { PcDocument } from "../../PlayerCharacter"
import { getMaxHp } from "../helpers"

export interface createHp {
  (character: PcDocument): ResourceDocument,
}

const createHp: ResourceStaticMethod<createHp> = function(this, pc) {
  const hpValue = getMaxHp(pc)

  const hpProps: Resource = {
    base_max: hpValue,
    current: hpValue,
    bonus_max: 0,
    temporary: 0
  }

  return new ResourceModel(hpProps)
}

export default createHp
