import { PlayerUserState } from "./PlayerUser"

export const saveFactory = (state: PlayerUserState) => () => {
  // get info from current state
  const {
    model,
  } = state

  // save
  return model.save()
}
