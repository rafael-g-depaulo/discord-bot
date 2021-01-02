import { Command, RegexCommand } from "@discord-bot/create-client"

import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { getPlayerUser } from "../Utils/getUser"
import logger from "../Utils/logger"

import { PlayerUserDocument } from "../Models/PlayerUser"

export const test: RegexCommand.test = commandWithFlags(
  /list-chars/,
  /list-characters/,
  /list\s*chars/,
  /list\s*characters/,
)

const listCharacters = (user: PlayerUserDocument) => user
  .characters
  .map((char, i) => `\t${i+1}. ${i === user.activeCharIndex ? `${char.name} (active)` : char.name}`)
  .join("\n")

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string }> = {
    player: { type: "string", optional: true },
  }
  const flags = parseFlags("!list-chars", flagsObject, regexResult?.groups?.flags, msg)
  if (flags === null) return

  const { player, fromFlags } = await getPlayerUser("!create-char", msg, flags.player)
  if (player === null) return

  if (player.characters.length === 0) {
    logger.info(`FB: (Command) list-chars: user "${msg.author.username}" called !list-chars`)
    const responseStr = fromFlags
      ? `Player "${player.username}" doesn't have any characters for me to list`
      : `you don't have any characters for me to list!`
    return msg.channel.send(responseStr)
  }
  
  logger.info(`FB: (Command) list-chars: user "${msg.author.username}" called !list-chars`)
  const charListString = fromFlags
    ? `Sure thing! Here are ${player.username}'s characters:\n\n${listCharacters(player)}`
    : `Sure thing! Here are your characters:\n\n` + listCharacters(player)
  return msg.channel.send(charListString)
}

const listChars: Command = {
  id: "Fantasy Battle: listCharacters",
  test,
  execute,
}

export default listChars
