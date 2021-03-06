import { Command, RegexCommand } from "@discord-bot/create-client"
import { capture, concat, fromList, optional, optionalSpace } from "@discord-bot/regex"

import { attributeNameRegex, getAttributeByNickname } from "../Models/PlayerCharacter"

import { commandWithFlags, setWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import { logFailure, logSuccess } from "../Utils/commandLog"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { bonusString } from "../Utils/string"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"

export const test: RegexCommand.test = commandWithFlags(
  concat(
    setWords,
    optionalSpace,
    optional(fromList([
      "attb",
      "atb",
      "atributo",
      "attribute",
      "attribut",
      "attrib",
    ])),
    optionalSpace,
    capture("attbNickname", attributeNameRegex),
  ),
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string, bonus: number, value: number }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
    bonus: { type: "number", optional: true },
    value: { type: "number", optional: true },
  }
  const flags = parseFlags("!setAttribute", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return

  const { player } = await getPlayerUser("!setAttribute", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!setAttribute", player, message, flags)
  if (!character) return
  
  // if no --value or --bonus flag
  if (flags.bonus === undefined && flags.value === undefined) {
    logFailure("!setAttribute", `command needs at least a --value or --bonus flag`, message, flags)
    return message.channel.send(`This command needs at least a --value or --bonus flag. Try again with one of those, please (ex: !setAttb might --bonus 6)`)
  }
  // attbName
  const attbName = getAttributeByNickname(regexResult.groups?.attbNickname ?? "")!

  // extract the old value and bonus
  const {
    value: oldValue,
    bonus: oldBonus,
  } = character.attributes[attbName]

  // update character's attribute values
  // if the value was given in the flags, use it. otherwise, use the character's usual
  const newValue = character.attributes[attbName].value = flags.value ?? character.attributes[attbName].value
  const newBonus = character.attributes[attbName].bonus = flags.bonus ?? character.attributes[attbName].bonus

  await player.save()

  const messageStr = `Ok! ${character.name}'s ${attbName} value changed from ${oldValue}${bonusString(oldBonus).replace(" ", "")} to ${newValue}${bonusString(newBonus).replace(" ", "")}`
  logSuccess("!setAttribute", message, flags)
  return message.channel.send(messageStr)
}

export const setAttribute: Command = {
  id: "Fantasy Battle: setAttribute",
  test,
  execute,
}

export default setAttribute
