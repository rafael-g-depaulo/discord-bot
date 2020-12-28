import { PlayerUserDocument, PlayerUserStaticMethod } from "../types"

export interface getUser {
  (userId: string): Promise<PlayerUserDocument | null>,
}

const getUser: PlayerUserStaticMethod<getUser> = async function(this, userId) {
  return await this.findOne({ userId })
}

export default getUser
