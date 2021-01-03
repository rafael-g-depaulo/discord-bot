import mockAttributes from "../../../Utils/mockAttributes"
import PcModel, { Pc, PcDocument } from ".."
import { AttributeNames, PcStaticMethod } from "../types"

export interface createPcProps {
  name: string,
  atkAttb?: AttributeNames,
}

export interface create {
  (props: createPcProps): PcDocument,
}

const create: PcStaticMethod<create> = function(this, { name, atkAttb }) {
  const pcProps: Pc = {
    name,
    attributes: mockAttributes(),
    defaultAtkAttb: atkAttb,
  }
  // deal with bad props
  if (typeof name !== 'string' || name === "") throw new Error(`Fantasy Battle: createCharacter(): name prop missing or empty`)

  return new PcModel(pcProps)
}

export default create
