import PlayerUserModel, { PlayerUser, PlayerUserDocument } from ".."
import { PlayerUserStaticMethod } from "../types"

export interface createPlayerUserProps {
  userId: string,
  username: string,
}

export interface getOrCreate {
  (props: createPlayerUserProps): Promise<PlayerUserDocument>,
}

const getOrCreate: PlayerUserStaticMethod<getOrCreate> = async function(this, { username, userId }) {

  // deal with bad props
  if (typeof username !== 'string' || username === "") throw new Error(`Fantasy Battle: getOrCreate(): username prop missing or empty`)
  if (typeof userId !== 'string' || userId === "") throw new Error(`Fantasy Battle: getOrCreate(): userId prop missing or empty`)

  const fetchedPlayer = await PlayerUserModel.getUser(userId)
  if (fetchedPlayer) return fetchedPlayer

  const user = PlayerUserModel.createUser({ userId, username })
  await user.save()
  return user
}

export default getOrCreate
