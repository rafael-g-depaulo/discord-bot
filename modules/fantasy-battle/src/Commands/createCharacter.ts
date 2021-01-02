import { Command, RegexCommand } from "@discord-bot/create-client"

import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import { commandWithFlags } from "../Utils/regex"
import logger from "../Utils/logger"

import PcModel from "../Models/PlayerCharacter"
import { getPlayerUser } from "../Utils/getUser"

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
  const args = parseFlags("!create-char", flagsObject, regexResult?.groups?.flags, msg)
  if (args === null) return
  
  const { player } = await getPlayerUser("!create-char", msg, args.player)
  if (player === null) return

  // if repeated name, return
  if (player.characters.some(char => char.name === args.name)) {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char, but already had a character named "${args.name}"`)
    return msg.channel.send(`You already have a character named "${args.name}"! You can't repeat names, be more creative`)
  }

  // create character
  const newPc = PcModel.createCharacter({ name: args.name! })
  player.addCharacter(newPc)

  logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" created character ${newPc.name}`)
  msg.channel.send(`Ok! Character "${newPc.name}" created for ${player.username}`)

  return player.save()
}

export const createCharacter: Command = {
  id: "Fantasy Battle: createCharacter",
  test,
  execute,
}

export default createCharacter
