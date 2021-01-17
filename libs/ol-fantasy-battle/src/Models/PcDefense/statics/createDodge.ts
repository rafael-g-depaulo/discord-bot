import DefenseModel, { Defense, DefenseDocument } from ".."
import { DefenseStaticMethod } from "../types"
import { PcDocument } from "../../PlayerCharacter"
import { getDodge } from "../helpers"

export interface createDodge {
  (character: PcDocument): DefenseDocument,
}

const createDodge: DefenseStaticMethod<createDodge> = function(this, pc) {
  const dodgeValue = getDodge(pc)

  const dodgeProps: Defense = {
    value: dodgeValue,
    bonus: 0,
  }

  return new DefenseModel(dodgeProps)
}

export default createDodge
