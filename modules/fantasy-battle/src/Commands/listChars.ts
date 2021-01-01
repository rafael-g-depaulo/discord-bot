import { Command, RegexCommand } from "@discord-bot/create-client"
import PlayerUserModel, { PlayerUserDocument } from "../Models/PlayerUser"
import parseArgsStringToArgv from "string-argv"
import logger from "../Utils/logger"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { isDm, isPlayer } from "../Utils/userPermissions"
import yargs from "yargs"

export const test: RegexCommand.test = /!(?:list-chars|list-characters|list\s*chars|list\s*characters)\s*(?<args>.*)?$/i

const listCharacters = (user: PlayerUserDocument) => user
  .characters
  .map((char, i) => `\t${i+1}. ${i === user.activeCharIndex ? `${char.name} (active)` : char.name}`)
  .join("\n")

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return

  // parse arguments
  const argsArr = parseArgsStringToArgv(regexResult?.groups?.args ?? "")
  const args = yargs(argsArr).argv

  // if --player flag present
  if (args.player) {

    // if --player flag of wrong type
    if (typeof args.player !== 'string') {
      logger.info(`FB: (Command) list-chars: user "${msg.author.username}" tried to !list-chars with the --player flag, but the flag type was bad`)
      return msg.channel.send(`wrong type for flag --player. flag --player expects a string`)
    }

    // if non-DM and trying to use --player "name" flag
    if (!isDm(msg.member)) {
      logger.info(`FB: (Command) list-chars: user "${msg.author.username}" tried to !list-chars with the --player flag, but they are not a DM`)
      return msg.channel.send(`only DM's can use this command with the --player flag`)
    }

    const player = await PlayerUserModel.findOne({ username: args.player })
    
    // if player doesn't exist
    if (!player) {
      logger.info(`FB: (Command) list-chars: DM "${msg.author.username}" tried to !list-chars with "--player=${args.player}", but ${args.player} isn't a registered Player in the Database`)
      return msg.channel.send(`player "${args.player}" doesn't exist in my database. are you sure you typed their name correctly?`)
    }

    // if player doesn't have any characters
    if (player.characters.length === 0) {
      logger.info(`FB: (Command) list-chars: DM "${msg.author.username}" called !list-chars with "--player=${args.player}"`)
      return msg.channel.send(`Player "${player.username}" doesn't have any characters for me to list`)
    }

    // if player exists
    logger.info(`FB: (Command) list-chars: DM "${msg.author.username}" called !list-chars with "--player=${args.player}"`)
    return msg.channel.send(`Sure thing! Here are ${player.username}'s characters:\n\n${listCharacters(player)}`)
  }

  // create of fetch the player user instance
  const user = await PlayerUserModel.fromAuthor(msg.author)
  if (user.characters.length === 0) {
    logger.info(`FB: (Command) list-chars: user "${msg.author.username}" called !list-chars`)
    return msg.channel.send(`you don't have any characters for me to list!`)
  }

  const charListString = `Sure thing! Here are your characters:\n\n` + listCharacters(user)

  logger.info(`FB: (Command) list-chars: user "${msg.author.username}" called !list-chars`)
  return msg.channel.send(charListString)
}

const listChars: Command = {
  id: "Fantasy Battle: listCharacters",
  test,
  execute,
}

export default listChars
