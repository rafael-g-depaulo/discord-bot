import Discord from "discord.js"
import { Composable } from "Composer"

export interface Command {
  test: (message: Discord.Message) => boolean,
  execute: (message: Discord.Message) => void,
}

export interface CommandState {
  discordClient: Discord.Client,
  commands?: Command[]
}

export interface CommandClient {
  addCommand: (cmd: Command) => void
}

export const CreateCommandClient: Composable<CommandState, CommandClient> = (state) => {
  const {
    discordClient,
    commands = [],
  } = state

  const addCommand = (cmd: Command) => {
    commands.push(cmd)
    discordClient.on("message", msg => {
      
      // if from bot, ignore
      if (msg.author.bot) return

      // if is command, execute it
      if (cmd.test(msg)) cmd.execute(msg)
    })
  }

  return {
    addCommand,
  }
}
