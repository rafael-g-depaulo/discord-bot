import { Command, RegexCommand } from "@discord-bot/create-client"

import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import logger from "../Utils/logger"

import PlayerUserModel from "../Models/PlayerUser"
import PcModel from "../Models/PlayerCharacter"

export const test: RegexCommand.test = /!(?:create-char|create\s*char)\s*(?<args>.*)?$/i

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return

  // create of fetch the player user instance
  const user = await PlayerUserModel.fromAuthor(msg.author)

  // parse arguments
  const flagsObject: FlagsObject<{ name: string }> = {
    name: { type: "string" },
  }
  const args = parseFlags(flagsObject, "!create-char", regexResult?.groups?.args, msg)
  if (args === null) return

  // if bad arguments
  if (!args.name || !(typeof args?.name === 'string') || args?.name === "") {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char without giving a character name`)
    return msg.channel.send(`!create-char command needs argument --name="characterNameHere" or --name characterName`)
  }

  // if repeated name, return
  if (user.characters.some(char => char.name === args.name)) {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char, but already had a character named "${args.name}"`)
    return msg.channel.send(`You already have a character named "${args.name}"! You can't repeat names, be more creative`)
  }

  // create character
  const newPc = PcModel.createCharacter({ name: args.name })
  user.addCharacter(newPc)

  logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" created character ${newPc.name}`)
  msg.channel.send(`Ok! Character "${newPc.name}" created for ${user.username}`)

  return user.save()
}

export const createCharacter: Command = {
  id: "Fantasy Battle: createCharacter",
  test,
  execute,
}

export default createCharacter
