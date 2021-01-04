import { Command, RegexCommand } from "@discord-bot/create-client"
import { capture } from "@discord-bot/regex"

import { attributeNameRegex, getAttributeByNickname } from "../Models/PlayerCharacter/helpers/attributes"

import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { getPlayerUser } from "../Utils/getUser"
import getPlayerChar from "../Utils/getPlayerChar"
import { resultString } from "@discord-bot/dice"
import { logSuccess } from "Utils/commandLog"

export const test: RegexCommand.test = commandWithFlags(
  capture("attbNickname", attributeNameRegex),
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

  // todo: extract bonus and advantage here

  const rollResult = character.rollAttribute(attbName)
  logSuccess("!rollAttribute", message, flags)
  message.channel.send(`**${character.name}**, rolling ${attbName}:\n\n${resultString(rollResult)}`)
}

export const rollAttribute: Command = {
  id: "Fantasy Battle: rollAttribute",
  test,
  execute,
}

export default rollAttribute
