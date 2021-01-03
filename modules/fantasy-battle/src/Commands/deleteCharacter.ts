import { Command, RegexCommand } from "@discord-bot/create-client"

import getPlayerChar from "../Utils/getPlayerChar"
import { getPlayerUser } from "../Utils/getUser"
import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"

export const test: RegexCommand.test = commandWithFlags(
  /delete-char/,
  /delete\s*char/,
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return
  
  // parse arguments
  const flagsObject: FlagsObject<{ char: string, player: string }> = {
    char: { type: "string" },
    player: { type: "string", optional: true },
  }
  const flags = parseFlags("!delete-char", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return

  const { player } = await getPlayerUser("!delete-char", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!delete-char", player, message, flags)
  if (!character) return

  // delete character
  player.characters = player.characters.filter(c => c !== character)
  
}

export const deleteCharacter: Command = {
  id: "Fantasy Battle: deleteCharacter",
  test,
  execute,
}

export default deleteCharacter
