import PlayerUserModel, { PlayerUserDocument } from "Models/PlayerUser"

import { saveFactory } from "./save"
import { addCharacterFactory } from "./addCharacter"
import PlayerUser, { PlayerUserState } from "./PlayerUser"
import logger from "Utils/logger"

export interface getPlayerUserProps {
  userId: string,
}

export const getUser = async (props: getPlayerUserProps): Promise<PlayerUser> => {
  // props
  const {
    userId,
  } = props
  
  // throw if bad props
  const model = await PlayerUserModel.getUser(userId)
  if (model === null) {
    logger.error(`PlayerUser: tried to get user with id "${userId}", but no user found`)
    throw new Error(`PlayerUser: tried to get user with id "${userId}", but no user found`)
  }

  // state
  const state: PlayerUserState = {
    model,
    userId: model.userId,
    username: model.username,
    characters: [],
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
