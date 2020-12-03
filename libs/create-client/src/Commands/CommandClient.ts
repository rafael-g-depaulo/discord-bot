import Discord from "discord.js"
import { Composable } from "Composer"
import addCommand from "./addCommand"

export interface DefaultCommand {
  test: (message: Discord.Message) => boolean,
  execute: (message: Discord.Message) => void,
}

export interface RegexCommand {
  test: RegExp,
  execute: (message: Discord.Message, results: RegExpExecArray) => void,
}

export type Command = DefaultCommand | RegexCommand

export interface CommandState {
  discordClient: Discord.Client,
  commands?: Command[]
}

export interface CommandClient {
  addCommand: (cmd: Command) => void
}

export const CreateCommandClient: Composable<CommandState, CommandClient> = (state) => {
  
  state.commands = []
  
  return {
    addCommand: addCommand(state),
  }
}
