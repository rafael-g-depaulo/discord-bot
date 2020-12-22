import PcModel, { Pc } from "../Models/PlayerCharacter"
import { createAttributes } from "./Attribute"
import PlayerCharacter, { PlayerCharacterState } from "./PlayerCharacter"
import { saveFactory } from "./save"
export interface createPlayerCharacterProps {
  name: string,
}

export const createCharacter = (props: createPlayerCharacterProps): PlayerCharacter => {
  const {
    name,
  } = props

  // throw if bad props
  if (typeof name !== 'string' || name === "") throw new Error(`Fantasy Battle: createCharacter(): name prop missing or empty`)

  // create model
  const modelProps: Pc = {
    name,
    attributes: createAttributes(),
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
