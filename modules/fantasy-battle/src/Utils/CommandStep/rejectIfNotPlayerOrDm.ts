import { Discord } from "@discord-bot/create-client"
import logger from "../logger"
import { isDm, isPlayer } from "../userPermissions"

const rejectIfNotPlayerOrDm = (msg: Discord.Message) => {
  // if user isn't admin or Player or DM, ignore
  if (!isPlayer(msg.member) && !isDm(msg.member)) {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char but isn't a Player or DM`)
    msg.channel.send(`sorry, but only people with the "Player" or "Dm" role can use this command`)
    return true
  }
  return false
}

export default rejectIfNotPlayerOrDm
