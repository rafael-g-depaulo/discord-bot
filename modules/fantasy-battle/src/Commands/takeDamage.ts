import { Command, RegexCommand } from "@discord-bot/create-client"
import { resultString, getArgs } from "@discord-bot/dice"
import { capture, concat, fromList, optional, optionalSpace } from "@discord-bot/regex"

import { attributeNameRegex, getAttributeByNickname } from "../Models/PlayerCharacter"

import { commandWithFlags, damageWords, rollWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { indexAfterSubstr, resourceString } from "../Utils/string"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { logSuccess } from "../Utils/commandLog"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"
import { bold } from "Utils/string/markdown"

const takeWords = fromList(["take", "tk", "tak", "tke", "tome", "toma", "tomar"])

export const test: RegexCommand.test = commandWithFlags(
  concat(takeWords, optionalSpace, damageWords, optionalSpace, capture("damage", /\d+/))
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
  }
  const flags = parseFlags("!takeDamage", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!takeDamage", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!takeDamage", player, message, flags)
  if (!character) return

  const damage = Number(regexResult.groups?.damage ?? 0) || 0

  const damageTaken = character.takeDamage(damage)
  await player.save()

  const mitigatedDamage = damage - damageTaken
  const responseString = mitigatedDamage > 0
    ? `Damage before mitigation: ${damage}`
    + `\nMitigated: ${damage - damageTaken}`
    + `\nDamage taken: ${damageTaken}`
    + "\n"
    + `\n${bold(character.name)}`
    + resourceString("HP", character.hp)

    : `Damage taken: ${damageTaken}`
    + `\n${bold(character.name)}`
    + resourceString("HP", character.hp)

  logSuccess("!takeDamage", message, flags)
  message.channel.send(responseString)
}

export const takeDamage: Command = {
  id: "Fantasy Battle: takeDamage",
  test,
  execute,
}

export default takeDamage
