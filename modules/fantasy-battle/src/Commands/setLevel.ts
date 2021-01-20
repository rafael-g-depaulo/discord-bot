import { Command, RegexCommand } from "@discord-bot/create-client"
import { capture, concat, fromList, optionalSpace } from "@discord-bot/regex"

import { commandWithFlags, setWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import { logSuccess } from "../Utils/commandLog"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"

export const test: RegexCommand.test = commandWithFlags(
  concat(
    setWords,
    /(?:\s*|-)/,
    fromList([
      "level",
      "lvl",
      "lv",
      "lev",
      "nivel",
      "nível",
    ]),
    optionalSpace,
    capture("level", /\d+/),
  ),
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
  }
  const flags = parseFlags("!setLevel", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!setLevel", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!setLevel", player, message, flags)
  if (!character) return

  const level = Number(regexResult.groups?.level) ?? character.level
  const oldLevel = character.level
  character.level = level
  await player.save()

  logSuccess("!setLevel", message, flags)
  message.channel.send(`Ok! ${character.name}'s Level changed from ${oldLevel} to ${level}`)
}

export const setLevel: Command = {
  id: "Fantasy Battle: setLevel",
  test,
  execute,
}

export default setLevel
