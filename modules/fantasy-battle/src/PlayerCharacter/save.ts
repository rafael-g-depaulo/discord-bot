import { PlayerCharacterState } from "./PlayerCharacter"

export const saveFactory = (state: PlayerCharacterState) => () => {
  // get info from current state
  const {
    name,
    model,
  } = state

  // update model with current state
  model.name = name

  // save
  return model.save()
}
