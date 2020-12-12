import Discord from "discord.js"

import { CreateModuleClient } from "./Client/ModuleClient"
import { CommandClient, CommandProps, CreateCommandClient } from "./Client/CommandClient"
import { CreateLoginClient, LoginClient, LoginProps } from "./Client/LoginClient"

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
export { Command } from "./Client/CommandClient"

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

  // add login and command capabilities
  let clientThing = Object.assign({},
    CreateLoginClient({ discordClient: state.discordClient }),
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

export default createClient
