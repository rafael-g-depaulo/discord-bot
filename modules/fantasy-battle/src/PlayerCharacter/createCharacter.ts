import PcModel, { Pc, PcDocument } from "Models/PlayerCharacter"
import { Attribute, AttributeNames, Attributes, createAttributes } from "./Attribute"
import { saveFactory } from "./save"

export interface PlayerCharacter {
  // actually important attributes
  name: string,
  attributes: {
    [key in AttributeNames]: Attribute
  },
  
  // model representation for character
  model: PcDocument,

  // method to save the character
  save: () => Promise<PcDocument>,
}

export interface PlayerCharacterProps {
  name: string,
}

export interface PlayerCharacterState {
  name: string,
  model: PcDocument,
  attributes: Attributes,
}

export const createCharacter = (props: PlayerCharacterProps): PlayerCharacter => {
  const {
    name,
  } = props

  // throw if bad props
  if (typeof name !== 'string' || name === "") throw new Error(`Fantasy Battle: createCharacter(): name prop missing or empty`)

  // create model
  const modelProps: Pc = {
    name,
  }

  // player state
  const state: PlayerCharacterState = {
    name,
    attributes: createAttributes(),

    model: new PcModel(modelProps),
  }

  // save model
  state.model.save()

  // methods
  const save = saveFactory(state)

  return {
    // name prop
    get name() { return state.name },
    set name(v) { state.name = v },

    // attributes
    get attributes() { return state.attributes },

    // model
    get model() { return state.model },

    save,
  }
}
