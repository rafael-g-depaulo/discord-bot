import { Command, RegexCommand } from "@discord-bot/create-client"
import { concat, fromList, nonCapture, optional, optionalSpace, or } from "@discord-bot/regex"

import { acString, defensesString, resourceString } from "../Utils/string"
import { charWords, commandWithFlags, restWords, viewWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { logSuccess } from "../Utils/commandLog"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"
import { bold } from "Utils/string/markdown"

const shortWords = fromList(["short", "shrt", "shor", "shr", "sho", "curto", "pequeno"])
export const test: RegexCommand.test = commandWithFlags(
  concat(shortWords, nonCapture(or(/-/, optionalSpace)), restWords),
  concat(restWords, nonCapture(or(/-/, optionalSpace)), shortWords),
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
    
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
  }
  const flags = parseFlags("!shortRest", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!shortRest", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!shortRest", player, message, flags)
  if (!character) return
  
  const recovered = character.shortRest()
  const recoveredHp = recovered.hp === 0 ? "" : ` (recovered ${recovered.hp})`
  const recoveredMp = recovered.mp === 0 ? "" : ` (recovered ${recovered.mp})`
  await player.save()

  logSuccess("!shortRest", message, flags)
  message.channel.send(`${bold(character.name)}:`
    + resourceString("HP", character.hp) + recoveredHp
    + resourceString("MP", character.mp) + recoveredMp
  )
}

export const shortRest: Command = {
  id: "Fantasy Battle: shortRest",
  test,
  execute,
}

export default shortRest
