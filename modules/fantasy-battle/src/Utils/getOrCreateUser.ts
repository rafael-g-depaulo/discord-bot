import { createPlayerUser, createPlayerUserProps, getPlayerUser, getPlayerUserProps, PlayerUser } from "../PlayerUser"

type Props = createPlayerUserProps & getPlayerUserProps
export const getOrCreatePlayerUser = async ({ userId, username }: Props): Promise<PlayerUser> => {

  // try to fetch player
  const fetchedPlayer = await getPlayerUser({ userId })
  // if player found, return them
  if (fetchedPlayer) return fetchedPlayer
  
  // if no player found, create player, save them and return
  const user = createPlayerUser({ userId, username })
  await user.save()
  return user
}
