import { Command, Message } from "@discord-bot/create-client"

import { parseArgsStringToArgv } from "string-argv"
import yargs from "yargs"

import logger from "../Utils/logger"
import { isDm, isPlayer } from "../Utils/userPermissions"

import PlayerUserModel from "../Models/PlayerUser"
import PcModel from "../Models/PlayerCharacter"

const createCharacter: Command = {
  id: "Fantasy Battle: createCharacter",
  test: /!create-char\s*(?<args>.*)?$/i,
  execute: async (msg: Message, regexResult) => {
    // if user isn't admin or Player or DM, ignore
    if (!isPlayer(msg.member) && !isDm(msg.member)) {
      logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" tried to !create-char but isn't a Player or DM`)
      return msg.channel.send(`sorry, but only people with the "Player" or "Dm" role can use this command`)
    }

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
      return msg.channel.send(`You already have a character named ${name}! You can't repeat names, be more creative`)
    }

    // create character
    const newPc = PcModel.createCharacter({ name: args.name })
    await user.addCharacter(newPc)

    logger.info(`FB: (Command) createCharacter: user "${msg.author.username}" created character ${newPc.name}`)
    msg.channel.send(`Ok! Character "${newPc.name}" created for ${user.username}`)

    return
  },
}

export default createCharacter
