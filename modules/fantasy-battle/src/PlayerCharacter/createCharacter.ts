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
  // throw if bad props
  // throw if bad props
  // throw if bad props

  // player state
  const state: PlayerCharacterState = {
    attributes: createAttributes()
  }

  return {
    name,
    attributes: state.attributes,
  }
}
