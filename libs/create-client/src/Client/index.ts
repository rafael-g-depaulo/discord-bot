import Discord from "discord.js"

import { CreateModuleClient } from "./ModuleClient"
import { CommandClient, CommandProps, CreateCommandClient } from "./CommandClient"
import { CreateLoginClient, LoginClient, LoginProps } from "./LoginClient"

export type DiscordLib = typeof Discord

// props for client creation
export interface ClientProps {
  discordLib?: DiscordLib,
  token?: string,
}

// inner state used by client (not available to library user)
type ClientState = LoginProps & CommandProps

// client type
export type Client = LoginClient & CommandClient & {
  discordClient: Discord.Client,
}

// create client function
export type CreateClient = (props?: ClientProps) => Client
const createClient: CreateClient = (props) => {
  const {
    discordLib = Discord,
    token,
  } = props ?? {}

  const discordClient = new discordLib.Client()

  const state: ClientState = {
    discordClient,
  }

  // add login and command capabilities
  let clientThing = Object.assign({},
    CreateLoginClient({ discordClient: state.discordClient, token }),
    CreateCommandClient({ discordClient: state.discordClient }),
  )

  // add modules (must be done after commands are created)
  clientThing = Object.assign(clientThing,
    CreateModuleClient({ addCommand: clientThing.addCommand, removeCommand: clientThing.removeCommand }),
  )
  
  return {
    discordClient,
    ...clientThing,
  }
}

// export message type
export { Message } from "discord.js"
// export command Type so lib users may use it
export { Command } from "./CommandClient"
// export module type to lib users may use it
export { Module } from "./ModuleClient"

export default createClient
