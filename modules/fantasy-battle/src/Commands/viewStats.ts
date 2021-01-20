import { Command, RegexCommand } from "@discord-bot/create-client"
import { concat, fromList, optional } from "@discord-bot/regex"

import { acString, defensesString, resourceString } from "../Utils/string"
import { charWords, commandWithFlags, viewWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { logSuccess } from "../Utils/commandLog"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"

const stats = fromList(["stat", "stats", "status", "estatus", "dados"])

export const test: RegexCommand.test = commandWithFlags(
  concat(optional(viewWords), stats),
  concat(optional(viewWords), charWords),
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
    
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
  }
  const flags = parseFlags("!viewStats", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!viewStats", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!viewStats", player, message, flags)
  if (!character) return
  
  const statsString = `**${character.name}** (level ${character.level})\n`
    + resourceString("HP", character.hp)
    + resourceString("MP", character.mp)
    + defensesString(character)
    + acString(character)

  logSuccess("!viewStats", message, flags)
  message.channel.send(statsString)
}

export const viewStats: Command = {
  id: "Fantasy Battle: viewStats",
  test,
  execute,
}

export default viewStats
