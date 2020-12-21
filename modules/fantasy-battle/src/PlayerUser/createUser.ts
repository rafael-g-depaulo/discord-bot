import PlayerUserModel, { PlayerUser as PlayerUserDocProps, PlayerUserDocument } from "../Models/PlayerUser"
import { PlayerCharacter } from "../PlayerCharacter"
import { addCharacterFactory } from "./addCharacter"

import { saveFactory } from "./save"

export interface PlayerUser {
  userId: string,
  username: string,

  // array of PlayerCharacters
  characters: PlayerCharacter[],

  // model representation for character
  model: PlayerUserDocument,

  // methods
  save: () => Promise<PlayerUserDocument>,
  addCharacter: (char: PlayerCharacter) => Promise<PlayerUserDocument>,
}

export interface PlayerUserProps {
  userId: string,
  username: string,
}

export interface PlayerUserState {
  // model representation for character
  model: PlayerUserDocument,
  characters: PlayerCharacter[]
}

export const createUser = (props: PlayerUserProps): PlayerUser => {
  // props
  const {
    userId,
    username,
  } = props

  // throw if bad props
  // throw if bad props

  const modelProps: PlayerUserDocProps = {
    userId,
    characters: [],
  }

  // state
  const state: PlayerUserState = {
    model: new PlayerUserModel(modelProps),
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
    get userId() { return userId },
    get username() { return username },
    
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
