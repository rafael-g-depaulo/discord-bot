import ResourceModel, { Resource, ResourceDocument } from ".."
import { ResourceStaticMethod } from "../types"
import { PcDocument } from "../../PlayerCharacter"
import { getMaxMp } from "../helpers"

export interface createMp {
  (character: PcDocument): ResourceDocument,
}

const createMp: ResourceStaticMethod<createMp> = function(this, pc) {
  const mpValue = getMaxMp(pc)

  const mpProps: Resource = {
    base_max: mpValue,
    current: mpValue,
    bonus_max: 0,
    temporary: 0
  }

  return new ResourceModel(mpProps)
}

export default createMp
