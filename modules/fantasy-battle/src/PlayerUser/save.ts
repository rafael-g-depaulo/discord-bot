import PcModel, { PcDocument } from "../Models/PlayerCharacter"
import { PlayerUserState } from "./PlayerUser"

export const saveFactory = (state: PlayerUserState) => () => {
  // get info from current state
  const {
    model,
    characters,
  } = state

  // create model representation of all characters
  model.characters = characters
    // .map<Pc>(({ name, attributes }) => ({ name, attributes }))
    .map<PcDocument>(props => new PcModel(props))

  // save
  return model.save()
}
