import { Command, RegexCommand } from "@discord-bot/create-client"
import { resultString, getArgs } from "@discord-bot/dice"
import { capture, concat, optional, optionalSpace } from "@discord-bot/regex"

import { attributeNameRegex, getAttributeByNickname } from "../Models/PlayerCharacter"

import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import { commandWithFlags, rollWords } from "../Utils/regex"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { indexAfterSubstr } from "../Utils/string"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"
import { logSuccess } from "../Utils/commandLog"

export const test: RegexCommand.test = commandWithFlags(
  concat(
    optional(concat(rollWords, optionalSpace)),
    capture("attbNickname", attributeNameRegex),
  )
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string, bonus: number }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
    bonus: { type: "number", optional: true },
  }
  const flags = parseFlags("!rollAttribute", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!rollAttribute", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!rollAttribute", player, message, flags)
  if (!character) return

  const attbName = getAttributeByNickname(regexResult.groups?.attbNickname ?? "")
  if (attbName === null) return // attbName should never be null, so i won't bother sending a message here

  // string representing the arguments after the attribute in the command
  // ex: "!might +2 adv-2" would become " +2 adv-2"
  const argsAfterAttribute = indexAfterSubstr(message.content, regexResult.groups!.attbNickname)
  // roll the character's attribute, applying extra arguments
  const rollResult = character.rollAttribute(attbName, getArgs(argsAfterAttribute))

  logSuccess("!rollAttribute", message, flags)
  message.channel.send(`**${character.name}**, rolling ${attbName}:\n\n${resultString(rollResult)}`)
}

export const rollAttribute: Command = {
  id: "Fantasy Battle: rollAttribute",
  test,
  execute,
}

export default rollAttribute
