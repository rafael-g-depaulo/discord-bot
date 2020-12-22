import { PcDocument } from "Models/PlayerCharacter"
import { createAttributes } from "./Attribute"
import PlayerCharacter, { PlayerCharacterState } from "./PlayerCharacter"
import { saveFactory } from "./save"

const createFromModel = (model: PcDocument): PlayerCharacter => {
  
  // player state
  const state: PlayerCharacterState = {
    name: model.name,
    attributes: createAttributes(model.attributes),
    model,
  }

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

export default createFromModel
