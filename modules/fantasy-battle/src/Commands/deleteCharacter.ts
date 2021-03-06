import { Command, RegexCommand } from "@discord-bot/create-client"

import getPlayerChar from "../Utils/CommandStep/getPlayerChar"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { logSuccess } from "../Utils/commandLog"

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
  player.removeCharacter(character)
  await player.save()

  logSuccess("!delete-char", message, flags)
  message.channel.send(`Ok! Character "${character.name}" deleted for ${player.username}`)
}

export const deleteCharacter: Command = {
  id: "Fantasy Battle: deleteCharacter",
  test,
  execute,
}

export default deleteCharacter
