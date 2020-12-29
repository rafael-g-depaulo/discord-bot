import mockAttributes from "Utils/mockAttributes"
import PlayerUserModel, { PlayerUser, PlayerUserDocument } from ".."
import { PlayerUserStaticMethod } from "../types"

export interface createPlayerUserProps {
  userId: string,
  username: string,
}

export interface create {
  (props: createPlayerUserProps): PlayerUserDocument,
}

const create: PlayerUserStaticMethod<create> = function(this, { username, userId }) {
  const userProps: PlayerUser = {
    userId,
    username,
    characters: [],
  }
  
  // deal with bad props
  if (typeof username !== 'string' || username === "") throw new Error(`Fantasy Battle: createCharacter(): username prop missing or empty`)
  if (typeof userId !== 'string' || userId === "") throw new Error(`Fantasy Battle: createCharacter(): userId prop missing or empty`)

  return new PlayerUserModel(userProps)
}

export default create
