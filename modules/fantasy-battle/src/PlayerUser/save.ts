import { PlayerUserState } from "./createUser"

export const saveFactory = (state: PlayerUserState) => () => {
  // get info from current state
  const {
    model,
  } = state

  // save
  return model.save()
}
