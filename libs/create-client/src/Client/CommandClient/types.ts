import Discord from "discord.js"

export type MessageListener = (message: Discord.Message) => void
export interface CommandListener {
  test: (message: Discord.Message) => boolean,
  execute: (message: Discord.Message) => Promise<any>,
}

export declare namespace DefaultCommand {
  export type test = (message: Discord.Message) => boolean
  export type execute = (message: Discord.Message) => void
}
export interface DefaultCommand {
  id: string,
  test: DefaultCommand.test,
  execute: DefaultCommand.execute,
}
export declare namespace RegexCommand {
  export type test = RegExp
  export type execute = (message: Discord.Message, results: RegExpExecArray) => void
}
export interface RegexCommand {
  id: string,
  test: RegexCommand.test,
  execute: RegexCommand.execute,
}

export type Command = DefaultCommand | RegexCommand
type CommandList = {
  command: Command,
  id: string,
  eventListener?: (msg: Discord.Message) => void
}[]

export interface CommandProps {
  discordClient: Discord.Client,
  commands?: Command[]
}

export interface CommandState {
  // commands: CommandList,
  commandListeners: Map<string, CommandListener>,
  discordMasterMessageListener?: MessageListener,
}

export interface CommandClient {
  addCommand: (cmd: Command) => void,
  removeCommand: (cmd: Command | string) => void,
}
