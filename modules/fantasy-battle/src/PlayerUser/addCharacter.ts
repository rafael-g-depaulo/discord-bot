import { PlayerUserDocument } from "Models/PlayerUser"
import { PlayerCharacter } from "PlayerCharacter"
import { PlayerUserState } from "./createUser"

export const addCharacterFactory = (state: PlayerUserState, save: () => Promise<PlayerUserDocument>) => async (char: PlayerCharacter) => {  
  // get info from current state
  const {
    model,
    characters,
  } = state

  // add to state
  characters.push(char)

  // add to model and save
  model.characters.push(char.model)
  // save()
  return model.save()

}
