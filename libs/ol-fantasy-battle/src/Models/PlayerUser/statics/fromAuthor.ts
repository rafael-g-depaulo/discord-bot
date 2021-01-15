import { Discord } from "@discord-bot/create-client"
import { PlayerUserDocument } from ".."
import { PlayerUserStaticMethod } from "../types"

export interface fromAuthor {
  (props: Discord.User): Promise<PlayerUserDocument>,
}

const fromAuthor: PlayerUserStaticMethod<fromAuthor> = async function(this, { username, id }) {
  return this.getOrCreate({ userId: id, username })
}

export default fromAuthor
