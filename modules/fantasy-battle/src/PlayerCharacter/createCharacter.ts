import { Attribute, AttributeNames, Attributes, createAttributes } from "./Attribute"

export interface PlayerCharacter {
  name: string,
  attributes: {
    [key in AttributeNames]: Attribute
  }
}

export interface PlayerCharacterProps {
  name: string,
}

interface PlayerCharacterState {
  attributes: Attributes,
}

export const createCharacter = (props: PlayerCharacterProps): PlayerCharacter => {
  const {
    name,
  } = props

  // throw if bad props
  if (typeof name !== 'string' || name === "") throw new Error(`Fantasy Battle: createCharacter(): name prop missing or empty`)

  // player state
  const state: PlayerCharacterState = {
    attributes: createAttributes()
  }

  return {
    name,
    attributes: state.attributes,
  }
}
