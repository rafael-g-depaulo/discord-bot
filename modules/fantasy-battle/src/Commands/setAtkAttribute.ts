import { Command, RegexCommand } from "@discord-bot/create-client"
import { concat } from "@discord-bot/regex"

import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import validateAttributeName from "../Utils/validateAttributeName"
import { commandWithFlags, setWords } from "../Utils/regex"
import { getPlayerUser } from "../Utils/getUser"
import getPlayerChar from "../Utils/getPlayerChar"
import { logSuccess } from "../Utils/commandLog"

export const test: RegexCommand.test = commandWithFlags(
  concat(setWords, /(?:\s*|-)(atk|attk|attack|atack)(?:\s*|-)(attb|atb|atribute|attribute)/),
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string, attb: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
    attb: { type: "string" },
  }
  const flags = parseFlags("!set-atk-attb", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!set-atk-attb", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!set-atk-attb", player, message, flags)
  if (!character) return

  const atkAttb = validateAttributeName("!set-atk-attb", message, flags, "attb")
  if (atkAttb === null) return

  character.defaultAtkAttb = atkAttb!
  await player.save()
  logSuccess("!set-atk-attb", message, flags)
  message.channel.send(`Ok! ${character.name}'s default attribute for attacks is now ${atkAttb}`)
}

export const setAtkAttribute: Command = {
  id: "Fantasy Battle: setAtkAttribute",
  test,
  execute,
}

export default setAtkAttribute
