import Discord from "discord.js"

import { CommandClient, CommandState, CreateCommandClient } from "./Commands/CommandClient"
import { CreateLoginClient, LoginClient, LoginState } from "./LoginClient"

export type DiscordLib = typeof Discord

// options for client creation
export interface ClientOptions {
  discordLib?: DiscordLib
}

// inner state used by client (not available to library user)
type ClientState = LoginState & CommandState

// client type
export type Client = LoginClient & CommandClient & {
  discordClient: Discord.Client,
}

// create client function
export type CreateClient = (options?: ClientOptions) => Client
const createClient: CreateClient = (options) => {
  const {
    discordLib = Discord
  } = options ?? {}

  const discordClient = new discordLib.Client()

  const state: ClientState = {
    discordClient
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
