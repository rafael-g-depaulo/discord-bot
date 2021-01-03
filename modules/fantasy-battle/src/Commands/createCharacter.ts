import { Command, RegexCommand } from "@discord-bot/create-client"

import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import { logFailure, logSuccess } from "../Utils/commandLog"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { getPlayerUser } from "../Utils/getUser"

import PcModel from "../Models/PlayerCharacter"

export const test: RegexCommand.test = commandWithFlags(
  /create-char/,
  /create\s*char/,
)

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return
  
  // parse arguments
  const flagsObject: FlagsObject<{ name: string, player: string }> = {
    name: { type: "string" },
    player: { type: "string", optional: true },
  }
  const flags = parseFlags("!create-char", flagsObject, regexResult?.groups?.flags, msg)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!create-char", msg, flags.player)
  if (player === null) return

  // if repeated name, return
  if (player.characters.some(char => char.name === flags.name)) {
    logFailure("!create-char", `already had a character named "${flags.name}"`, msg, flags)
    return msg.channel.send(`You already have a character named "${flags.name}"! You can't repeat names, be more creative`)
  }

  // create character
  const newPc = PcModel.createCharacter({ name: flags.name! })
  player.addCharacter(newPc)

  logSuccess("!create-char", msg, flags)
  msg.channel.send(`Ok! Character "${newPc.name}" created for ${player.username}`)

  return player.save()
}

export const createCharacter: Command = {
  id: "Fantasy Battle: createCharacter",
  test,
  execute,
}

export default createCharacter
