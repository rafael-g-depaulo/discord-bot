import { PlayerUserDocument } from "../Models/PlayerUser"
import PlayerCharacter from "../PlayerCharacter/PlayerCharacter"

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

export interface PlayerUserState {
  userId: string,
  username: string,
  // model representation for character
  model: PlayerUserDocument,
  characters: PlayerCharacter[]
}

export default PlayerUser
