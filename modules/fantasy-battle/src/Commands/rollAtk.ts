import { Command, RegexCommand } from "@discord-bot/create-client"
import { resultString, getArgs } from "@discord-bot/dice"
import { capture, concat, optional, optionalSpace } from "@discord-bot/regex"

import { attributeNameRegex, getAttributeByNickname } from "../Models/PlayerCharacter"

import { atkWords, commandWithFlags, rollWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { indexAfterSubstr } from "../Utils/string"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"
import { logSuccess } from "../Utils/commandLog"

export const test: RegexCommand.test = commandWithFlags(
  concat(
    optional(rollWords),
    optionalSpace,
    capture("atk", atkWords),
    optionalSpace,
    optional(capture("attbNickname", attributeNameRegex)),
  )
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
  }
  const flags = parseFlags("!rollAtk", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!rollAtk", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!rollAtk", player, message, flags)
  if (!character) return

  const attbName = getAttributeByNickname(regexResult.groups?.attbNickname ?? "") ?? character.defaultAtkAttb

  // string representing the arguments after the attribute in the command
  // ex: "!might +2 adv-2" would become " +2 adv-2"
  const argsAfterAttribute = !!regexResult.groups?.attbNickname
    ? indexAfterSubstr(message.content, regexResult.groups!.attbNickname)
    : indexAfterSubstr(message.content, regexResult.groups!.atk)
  // roll the character's attribute, applying extra arguments
  const rollResult = character.rollAtk(attbName, getArgs(argsAfterAttribute))

  logSuccess("!rollAtk", message, flags)
  message.channel.send(`**${character.name}**, attacking with ${attbName}:\n\n${resultString(rollResult)}`)
}

export const rollAtk: Command = {
  id: "Fantasy Battle: rollAtk",
  test,
  execute,
}

export default rollAtk
