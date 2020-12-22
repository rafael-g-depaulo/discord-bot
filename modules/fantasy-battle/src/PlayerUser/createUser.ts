import PlayerUserModel, { PlayerUser as PlayerUserDocProps } from "../Models/PlayerUser"
import { addCharacterFactory } from "./addCharacter"
import { PlayerUser, PlayerUserState } from "./PlayerUser"

import { saveFactory } from "./save"
export interface createPlayerUserProps {
  userId: string,
  username: string,
}

export const createUser = (props: createPlayerUserProps): PlayerUser => {
  // props
  const {
    userId,
    username,
  } = props

  // throw if bad props
  if (!userId || !username || typeof userId !== "string" || typeof username !== "string")
  throw new Error(`PlayerUser.createUser(): Invalid props for createUser`)

  const modelProps: PlayerUserDocProps = {
    userId,
    username,
    characters: [],
  }

  // state
  const state: PlayerUserState = {
    model: new PlayerUserModel(modelProps),
    characters: [],
    userId,
    username,
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

export default createUser
