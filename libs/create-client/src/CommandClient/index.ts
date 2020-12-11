import Discord from "discord.js"
import { Composable } from "Composer"
import CreateAddCommand from "./addCommand"

export interface DefaultCommand {
  id: string,
  test: (message: Discord.Message) => boolean,
  execute: (message: Discord.Message) => void,
}

export const isDefaultCommand = <(cmd: Command) => cmd is DefaultCommand>((cmd) => {
  return cmd.test instanceof Function
})

export interface RegexCommand {
  id: string,
  test: RegExp,
  execute: (message: Discord.Message, results: RegExpExecArray) => void,
}

export const isRegexCommand = <(cmd: Command) => cmd is RegexCommand>((cmd) => {
  return cmd.test instanceof RegExp
})

export type Command = DefaultCommand | RegexCommand
type CommandList = { command: Command, id: string }[]

export interface CommandProps {
  discordClient: Discord.Client,
  commands?: Command[]
}

export interface CommandState {
  commands: CommandList,
}

export interface CommandClient {
  addCommand: (cmd: Command) => void
}

export const CreateCommandClient: Composable<CommandProps, CommandClient> = (props) => {
  
  const {
    commands: commandsProp = [],
  } = props

  const state: CommandState = {
    commands: commandsProp.map(command => ({ command, id: command.id }))
  } 
  
  // create addCommand
  const addCommand = CreateAddCommand(props, state)

  // add all prop commands to client
  state.commands.forEach(({ command }) => addCommand(command))

  return {
    addCommand,
  }
}
