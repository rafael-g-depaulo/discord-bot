import mockAttributes from "../../../Utils/mockAttributes"
import PcModel, { Pc, PcDocument } from ".."
import { AttributeName, PcStaticMethod } from "../types"
import ResourceModel from "../../PcResource"
import DefenseModel from "../../PcDefense"

export interface createPcProps {
  name: string,
  atkAttb?: AttributeName,
  level?: number
  hpDiceAttb?: AttributeName,
  mpDiceAttb?: AttributeName,
}

export interface create {
  (props: createPcProps): PcDocument,
}

const create: PcStaticMethod<create> = function(this, { name, atkAttb, level, hpDiceAttb, mpDiceAttb }) {
  const pcProps: Pc = {
    name,
    attributes: mockAttributes(),  
    defaultAtkAttb: atkAttb,
    hpDiceAttb,
    mpDiceAttb,
    level,
  }
  // deal with bad props
  if (typeof name !== 'string' || name === "") throw new Error(`Fantasy Battle: createCharacter(): name prop missing or empty`)

  const pc = new PcModel(pcProps)
  pc.hp = ResourceModel.createHp(pc)
  pc.mp = ResourceModel.createMp(pc)
  pc.guard = DefenseModel.createGuard(pc)
  pc.dodge = DefenseModel.createDodge(pc)
  return pc
}

export default create
