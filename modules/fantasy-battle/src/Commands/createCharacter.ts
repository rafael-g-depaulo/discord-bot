import { Command, Message } from "@discord-bot/create-client"

import logger from "../Utils/logger"
import { isDm, isPlayer } from "../Utils/userPermissions"
import { getOrCreatePlayerUser } from "../Utils/getOrCreateUser"

const createCharacter: Command = {
  id: "Fantasy Battle: createCharacter",
  test: /!create-char/i,
  execute: async (msg: Message) => {
    // if user isn't admin or Player or DM, ignore
    if (!isPlayer(msg.member) && !isDm(msg.member))
    return msg.channel.send(`sorry, but only people with the "Player" or "Dm" role can use this command`)

    // if player is already saved in DB, retrieve it
    console.log(msg.author.id, typeof msg.author.id)

    const user = await getOrCreatePlayerUser({ userId: msg.author.id, username: msg.author.username })

    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here
    // logic to parse arguments and create character goes here

    // if player isn't already in DB, create it
    msg.channel.send("")
    return
  },
}

export default createCharacter
