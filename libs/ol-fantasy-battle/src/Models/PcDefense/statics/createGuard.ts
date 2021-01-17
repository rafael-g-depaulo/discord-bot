import DefenseModel, { Defense, DefenseDocument } from ".."
import { DefenseStaticMethod } from "../types"
import { PcDocument } from "../../PlayerCharacter"
import { getGuard } from "../helpers"

export interface createGuard {
  (character: PcDocument): DefenseDocument,
}

const createGuard: DefenseStaticMethod<createGuard> = function(this, pc) {
  const guardValue = getGuard(pc)

  const guardProps: Defense = {
    value: guardValue,
    bonus: 0,
  }

  return new DefenseModel(guardProps)
}

export default createGuard
