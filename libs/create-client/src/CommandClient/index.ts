import Discord from "discord.js"
import { Composable } from "Composer"
import CreateAddCommand from "./addCommand"

export interface DefaultCommand {
  test: (message: Discord.Message) => boolean,
  execute: (message: Discord.Message) => void,
}

export const isDefaultCommand = <(cmd: Command) => cmd is DefaultCommand>((cmd) => {
  return cmd.test instanceof Function
})

export interface RegexCommand {
  test: RegExp,
  execute: (message: Discord.Message, results: RegExpExecArray) => void,
}

export const isRegexCommand = <(cmd: Command) => cmd is RegexCommand>((cmd) => {
  return cmd.test instanceof RegExp
})

export type Command = DefaultCommand | RegexCommand

export interface CommandProps {
  discordClient: Discord.Client,
  commands?: Command[]
}

export interface CommandClient {
  addCommand: (cmd: Command) => void
}

export const CreateCommandClient: Composable<CommandProps, CommandClient> = (props) => {
  
  const {
    discordClient,
    commands: commandsProp = [],
  } = props

  const commands: Command[] = commandsProp
  
  // create addCommand
  const addCommand = CreateAddCommand({ discordClient, commands })
  // add all prop commands to client
  commands.forEach(command => addCommand(command))

  return {
    addCommand,
  }
}
