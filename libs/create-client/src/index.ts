import Discord from "discord.js"

import { CommandClient, CommandProps, CreateCommandClient } from "./CommandClient"
import { CreateLoginClient, LoginClient, LoginProps } from "./LoginClient"

export type DiscordLib = typeof Discord

// props for client creation
export interface ClientProps {
  discordLib?: DiscordLib
}

// inner state used by client (not available to library user)
type ClientState = LoginProps & CommandProps

// client type
export type Client = LoginClient & CommandClient & {
  discordClient: Discord.Client,
}

// export message type
export { Message } from "discord.js"
// export command Type so users may use it
export { Command } from "./CommandClient"

// create client function
export type CreateClient = (options?: ClientProps) => Client
const createClient: CreateClient = (options) => {
  const {
    discordLib = Discord
  } = options ?? {}

  const discordClient = new discordLib.Client()

  const state: ClientState = {
    discordClient,
  }

  const clientThing = Object.assign({},
    CreateLoginClient(state),
    CreateCommandClient(state),
  )
  
  return {
    discordClient,
    ...clientThing,
  }
}

export default createClient
