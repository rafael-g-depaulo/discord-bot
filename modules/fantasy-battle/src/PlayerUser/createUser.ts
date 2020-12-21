import PlayerUserModel, { PlayerUser as PlayerUserDocProps, PlayerUserDocument } from "../Models/PlayerUser"
import { saveFactory } from "./save"

export interface PlayerUser {
  userId: string,
  username: string,

  // model representation for character
  model: PlayerUserDocument,

  // methods
  save: () => Promise<PlayerUserDocument>
}

export interface PlayerUserProps {
  userId: string,
  username: string,
}

export interface PlayerUserState {
  // model representation for character
  model: PlayerUserDocument,
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
    model: new PlayerUserModel(modelProps)
  }

  // methods

  // save model
  const save = saveFactory(state)

  // return PlayerUser object
  return {
    // props
    get userId() { return userId },
    get username() { return username },
    
    // model
    get model() { return state.model },

    // methods
    save,
  }
}

export default createUser
