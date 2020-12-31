import { Command } from "@discord-bot/create-client"
import { RegexCommand } from "@discord-bot/create-client"

import { parseArgsStringToArgv } from "string-argv"
import yargs from "yargs"

import logger from "../Utils/logger"

import PlayerUserModel from "../Models/PlayerUser"
import PcModel from "../Models/PlayerCharacter"
import rejectIfNotPlayerOrDm from "Utils/rejectIfNotPlayerOrDm"

export const test: RegexCommand.test = /!(?:create-char|create\s*char)\s*(?<args>.*)?$/i

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return

  // create of fetch the player user instance
  const user = await PlayerUserModel.getOrCreate({ userId: msg.author.id, username: msg.author.username })

  // parse arguments
  const argsArr = parseArgsStringToArgv(regexResult?.groups?.args ?? "")
  const args = yargs(argsArr).argv

  // if bad arguments
  if (!args.name || !(typeof args?.name === 'string') || args?.name === "") {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char without giving a character name`)
    return msg.channel.send(`!create-char command needs argument --name="characterNameHere" or --name characterName`)
  }

  // extract args
  const {
    name,
  } = args

  // if repeated name, return
  if (user.characters.some(char => char.name === name)) {
    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char, but already had a character named "${name}"`)
    return msg.channel.send(`You already have a character named "${name}"! You can't repeat names, be more creative`)
  }

  // create character
  const newPc = PcModel.createCharacter({ name: args.name })
  await user.addCharacter(newPc)

  logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" created character ${newPc.name}`)
  msg.channel.send(`Ok! Character "${newPc.name}" created for ${user.username}`)

  return
}

export const createCharacter: Command = {
  id: "Fantasy Battle: createCharacter",
  test,
  execute,
}

export default createCharacter
