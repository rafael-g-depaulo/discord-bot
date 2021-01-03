import { Command, Message, RegexCommand } from "@discord-bot/create-client"

import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import { getPlayerUser } from "../Utils/getUser"
import logger from "../Utils/logger"

export const test: RegexCommand.test = commandWithFlags(
  /set(?:\s*|-)active(?:\s*|-)(char|character)/,
  /set(?:\s*|-)active/,
)

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", }
  }
  const flags = parseFlags("!set-active-char", flagsObject, regexResult?.groups?.flags, msg)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!set-active-char", msg, flags.player)
  if (player === null) return

  const newActiveChar = player.getCharacter(flags.char!)

  // if character not found
  if (!newActiveChar) {
    logger.info(`FB: (Command) set-active: user ${msg.author.username} called !set-active for player ${player.username}, but given character "${flags.char}" didn't correspond to one of their characters`)
    return msg.channel.send(`Player ${player.username} doesn't have a character that matches "${flags.char}". Try "!listChars" to see available characters`)
  }

  // if everything is ok and player and character were found
  player.activeCharIndex = player.characters.indexOf(newActiveChar)
  await player.save()

  logger.info(`FB: (Command) set-active: user ${msg.author.username} called !set-active, with character ${flags.char}`)
  return msg.channel.send(`Ok! "${newActiveChar.name}" set as currently active character for ${player.username}`)
}

export const setActiveChar: Command = {
  id: "Fantasy Battle: setActiveChar",
  test,
  execute,
}

export default setActiveChar
