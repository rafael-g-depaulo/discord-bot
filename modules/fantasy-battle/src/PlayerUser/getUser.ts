import PlayerUserModel from "../Models/PlayerUser"
import createFromModel from "../PlayerCharacter/createFromModel"

import { saveFactory } from "./save"
import { addCharacterFactory } from "./addCharacter"
import PlayerUser, { PlayerUserState } from "./PlayerUser"

export interface getPlayerUserProps {
  userId: string,
}

export const getUser = async (props: getPlayerUserProps): Promise<PlayerUser | null> => {
  // props
  const {
    userId,
  } = props
  
  // if can't fetch user, return null
  const model = await PlayerUserModel.getUser(userId)
  if (model === null) return null

  // state
  const state: PlayerUserState = {
    model,
    userId: model.userId,
    username: model.username,
    characters: model.characters.map(charModel => createFromModel(charModel)),
  }
  
  // methods
  // save model
  const save = saveFactory(state)
  // addCharacter
  const addCharacter = addCharacterFactory(state, save)
  
  // return PlayerUser object
  return {
    // props
    get userId() { return state.userId },
    get username() { return state.username },
    
    // model
    get model() { return state.model },

    // characters
    get characters() { return state.characters },

    // methods
    save,
    addCharacter,
  }
}

export default getUser
