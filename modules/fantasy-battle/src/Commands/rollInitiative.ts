import { Command, RegexCommand } from "@discord-bot/create-client"
import { resultString, getArgs } from "@discord-bot/dice"
import { capture, concat, fromList, optional, optionalSpace } from "@discord-bot/regex"

import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import { commandWithFlags, rollWords } from "../Utils/regex"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { indexAfterSubstr } from "../Utils/string"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"
import { logSuccess } from "../Utils/commandLog"

const initiativeWords = fromList(["init", "ini", "initi", "initia", "initiat", "inic", "iniciat", "initiative", "iniciativa", "iniciative"])

export const test: RegexCommand.test = commandWithFlags(
  concat(
    optional(concat(rollWords, optionalSpace)),
    capture("initiativeWord", initiativeWords),
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
  const flags = parseFlags("!initiative", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!initiative", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!initiative", player, message, flags)
  if (!character) return

  // string representing the arguments after the attribute in the command
  // ex: "!initiative +2 adv-2" would become " +2 adv-2"
  const argsAfterAttribute = indexAfterSubstr(message.content, regexResult.groups!.initiativeWord)
  const rollResult = character.rollInitiative(getArgs(argsAfterAttribute))

  logSuccess("!initiative", message, flags)
  message.channel.send(`**${character.name}**, rolling Initiative:\n\n${resultString(rollResult)}`)
}

export const rollInitiative: Command = {
  id: "Fantasy Battle: rollInitiative",
  test,
  execute,
}

export default rollInitiative
