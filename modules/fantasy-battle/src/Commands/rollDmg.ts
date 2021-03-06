import { Command, RegexCommand } from "@discord-bot/create-client"
import { resultString, getArgs } from "@discord-bot/dice"
import { capture, concat, optional, optionalSpace } from "@discord-bot/regex"

import { attributeNameRegex, getAttributeByNickname } from "../Models/PlayerCharacter"

import { commandWithFlags, damageWords, rollWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { indexAfterSubstr } from "../Utils/string"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { logSuccess } from "../Utils/commandLog"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"

export const test: RegexCommand.test = commandWithFlags(
  concat(
    optional(concat(rollWords, optionalSpace)),
    damageWords,
    optionalSpace,
    optional(capture("attbNickname", attributeNameRegex))
  ),
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
  const flags = parseFlags("!rollDmg", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!rollDmg", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!rollDmg", player, message, flags)
  if (!character) return

  const attbName = getAttributeByNickname(regexResult.groups?.attbNickname ?? "")

  // string representing the arguments after the attribute in the command
  // ex: "!might +2 adv-2" would become " +2 adv-2"
  const argsAfterAttribute = regexResult.groups?.attbNickname
    ? indexAfterSubstr(message.content, regexResult.groups!.attbNickname)
    : test.exec(message.content)?.groups?.flags ?? ""
  const attributeName = attbName ?? character.defaultAtkAttb
  // roll the character's attribute, applying extra arguments
  const rollResult = character.rollDmg(attributeName, getArgs(argsAfterAttribute))

  logSuccess("!rollDmg", message, flags)
  message.channel.send(`**${character.name}**, rolling damage for ${attributeName}:\n\n${resultString(rollResult)}`)
}

export const rollDmg: Command = {
  id: "Fantasy Battle: rollDmg",
  test,
  execute,
}

export default rollDmg
