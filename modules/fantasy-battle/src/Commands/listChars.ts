import { Command, RegexCommand } from "@discord-bot/create-client"

import parseFlags, { FlagsObject } from "../Utils/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/rejectIfNotPlayerOrDm"
import { isDm } from "../Utils/userPermissions"
import logger from "../Utils/logger"

import PlayerUserModel, { PlayerUserDocument } from "../Models/PlayerUser"

export const test: RegexCommand.test = /!(?:list-chars|list-characters|list\s*chars|list\s*characters)\s*(?<args>.*)?$/i

const listCharacters = (user: PlayerUserDocument) => user
  .characters
  .map((char, i) => `\t${i+1}. ${i === user.activeCharIndex ? `${char.name} (active)` : char.name}`)
  .join("\n")

export const execute: RegexCommand.execute = async (msg, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(msg)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string }> = {
    player: { type: "string", optional: true },
  }
  const flags = parseFlags(flagsObject, "!list-chars", regexResult?.groups?.args, msg)
  if (flags === null) return

  // if --player flag present
  if (flags.player) {

    // if non-DM and trying to use --player "name" flag
    if (!isDm(msg.member)) {
      logger.info(`FB: (Command) list-chars: user "${msg.author.username}" tried to !list-chars with the --player flag, but they are not a DM`)
      return msg.channel.send(`only DM's can use this command with the --player flag`)
    }

    const player = await PlayerUserModel.findOne({ username: flags.player })
    
    // if player doesn't exist
    if (!player) {
      logger.info(`FB: (Command) list-chars: DM "${msg.author.username}" tried to !list-chars with "--player=${flags.player}", but ${flags.player} isn't a registered Player in the Database`)
      return msg.channel.send(`player "${flags.player}" doesn't exist in my database. are you sure you typed their name correctly?`)
    }

    // if player doesn't have any characters
    if (player.characters.length === 0) {
      logger.info(`FB: (Command) list-chars: DM "${msg.author.username}" called !list-chars with "--player=${flags.player}"`)
      return msg.channel.send(`Player "${player.username}" doesn't have any characters for me to list`)
    }

    // if player exists
    logger.info(`FB: (Command) list-chars: DM "${msg.author.username}" called !list-chars with "--player=${flags.player}"`)
    return msg.channel.send(`Sure thing! Here are ${player.username}'s characters:\n\n${listCharacters(player)}`)
  }

  // create of fetch the player user instance
  const user = await PlayerUserModel.fromAuthor(msg.author)
  if (user.characters.length === 0) {
    logger.info(`FB: (Command) list-chars: user "${msg.author.username}" called !list-chars`)
    return msg.channel.send(`you don't have any characters for me to list!`)
  }
  
  logger.info(`FB: (Command) list-chars: user "${msg.author.username}" called !list-chars`)
  const charListString = `Sure thing! Here are your characters:\n\n` + listCharacters(user)
  return msg.channel.send(charListString)
}

const listChars: Command = {
  id: "Fantasy Battle: listCharacters",
  test,
  execute,
}

export default listChars
