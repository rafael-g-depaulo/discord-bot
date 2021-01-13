import { Discord } from "@discord-bot/create-client"

import { PlayerUserDocument } from "../../Models/PlayerUser"

import { logFailure, Flags } from "../commandLog"

const getPlayerChar = (commandName: string, player: PlayerUserDocument, message: Discord.Message, flags: Flags) => {

  // if flags.char not given, use player's default char
  if (!flags.char) return player.activeChar

  // if flags.char exists, use it
  const playerChar = player.getCharacter(`${flags.char}`)

  // if character not found
  if (!playerChar) {
    logFailure(commandName, `given character "${flags.char}" didn't correspond to one of their characters`, message, flags)
    message.channel.send(`Player ${player.username} doesn't have a character that matches "${flags.char}". Try "!listChars" to see available characters`)
  }

  return playerChar
}

export default getPlayerChar
