import Discord from "discord.js"
import { CreateLoginClient, LoginClient, LoginState } from "./Login"

export type DiscordLib = typeof Discord

// options for client creation
export interface ClientOptions {
  discordLib?: DiscordLib
}

// inner state used by client (not available to library user)
type ClientState = LoginState

// client type
export type Client = LoginClient & {
  client: Discord.Client,
}

// create client function
export type CreateClient = (options?: ClientOptions) => Client
const createClient: CreateClient = (options) => {
  const {
    discordLib = Discord
  } = options ?? {}

  const client = new discordLib.Client()

  const state = { client } as ClientState

  const clientThing = Object.assign({},
    CreateLoginClient(state),
  )

  return {
    client,
    ...clientThing,
  }
}

export default createClient
