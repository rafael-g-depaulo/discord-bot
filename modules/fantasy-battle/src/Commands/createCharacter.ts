import { Command, RegexCommand } from "@discord-bot/create-client"

import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import { commandWithFlags } from "../Utils/regex"
import logger from "../Utils/logger"

import PlayerUserModel from "../Models/PlayerUser"
import PcModel from "../Models/PlayerCharacter"
import { isPlayer } from "Utils/userPermissions"

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
  const args = parseFlags(flagsObject, "!create-char", regexResult?.groups?.flags, msg)
  if (args === null) return
  
  // if bad permissions with flag --player
  if (args.player && isPlayer(msg.member)) {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char with --player flag, but they aren't a DM`)
    return msg.channel.send(`only DM's can use this command with the --player flag`)
  }

  // create of fetch the player user instance (if --player flag, fetch from args)
  const user = args.player
    ? await PlayerUserModel.findOne({ username: args.player })
    : await PlayerUserModel.fromAuthor(msg.author)

  // if player
  if (!user) {
    logger.info(`FB: (Command) create-char: DM "${msg.author.username}" tried to !create-char with "--player=${args.player}", but ${args.player} isn't a registered Player in the Database`)
  return msg.channel.send(`player "${args.player}" doesn't exist in my database. are you sure you typed their name correctly?`)
  }

  // if repeated name, return
  if (user.characters.some(char => char.name === args.name)) {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char, but already had a character named "${args.name}"`)
    return msg.channel.send(`You already have a character named "${args.name}"! You can't repeat names, be more creative`)
  }

  // create character
  const newPc = PcModel.createCharacter({ name: args.name! })
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
