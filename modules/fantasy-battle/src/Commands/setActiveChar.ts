import { Command, Message, RegexCommand } from "@discord-bot/create-client"

import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import { logFailure, logSuccess } from "../Utils/commandLog"
import { getPlayerUser } from "../Utils/getUser"

export const test: RegexCommand.test = commandWithFlags(
  /set(?:\s*|-)active(?:\s*|-)(char|character)/,
  /set(?:\s*|-)active/,
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", }
  }
  const flags = parseFlags("!set-active-char", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!set-active-char", message, flags.player)
  if (player === null) return

  const newActiveChar = player.getCharacter(flags.char!)

  // if character not found
  if (!newActiveChar) {
    logFailure("!list-chars", `given character "${flags.char}" didn't correspond to one of their characters`, message, flags)
    return message.channel.send(`Player ${player.username} doesn't have a character that matches "${flags.char}". Try "!listChars" to see available characters`)
  }

  // if everything is ok and player and character were found
  player.activeCharIndex = player.characters.indexOf(newActiveChar)
  await player.save()

  logSuccess("!list-chars", message, flags)
  return message.channel.send(`Ok! "${newActiveChar.name}" set as currently active character for ${player.username}`)
}

export const setActiveChar: Command = {
  id: "Fantasy Battle: setActiveChar",
  test,
  execute,
}

export default setActiveChar
