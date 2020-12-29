import Discord, { Message } from "discord.js"
import { Composable } from "Composer"
import CreateAddCommand from "./addCommand"
import CreateRemoveCommand from "./removeCommand"

export namespace DefaultCommand {
  export type test = (message: Discord.Message) => boolean
  export type execute = (message: Discord.Message) => void
}
export interface DefaultCommand {
  id: string,
  test: DefaultCommand.test,
  execute: DefaultCommand.execute,
}

export const isDefaultCommand = <(cmd: Command) => cmd is DefaultCommand>((cmd) => {
  return cmd.test instanceof Function
})


export namespace RegexCommand {
  export type test = RegExp
  export type execute = (message: Discord.Message, results: RegExpExecArray) => void
}
export interface RegexCommand {
  id: string,
  test: RegexCommand.test,
  execute: RegexCommand.execute,
}

export const isRegexCommand = <(cmd: Command) => cmd is RegexCommand>((cmd) => {
  return cmd.test instanceof RegExp
})

export type Command = DefaultCommand | RegexCommand
type CommandList = {
  command: Command,
  id: string,
  eventListener?: (msg: Message) => void
}[]

export interface CommandProps {
  discordClient: Discord.Client,
  commands?: Command[]
}

export interface CommandState {
  commands: CommandList,
}

export interface CommandClient {
  addCommand: (cmd: Command) => void,
  removeCommand: (cmd: Command | string) => void,
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
  
  // create removeCommand
  const removeCommand = CreateRemoveCommand(props, state)

  // add all prop commands to client
  state.commands.forEach(({ command }) => addCommand(command))

  return {
    addCommand,
    removeCommand,
  }
}
