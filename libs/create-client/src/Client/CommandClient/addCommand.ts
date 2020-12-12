import { Message } from "discord.js"
import { Command, CommandProps, CommandState, isRegexCommand } from "./index"

export const CreateAddCommand = (props: CommandProps, state: CommandState) => (cmd: Command) => {
  const { discordClient } = props

  // create and add event listener
  let eventListener: undefined | ((msg: Message) => void)

    // if is a regex-style command
    if (isRegexCommand(cmd)) {
      eventListener = (msg: Message) => {
        // if from bot, ignore
        if (msg.author.bot) return
        // if message is command, execute it
        const commandRegex = cmd.test
        const result = commandRegex.exec(msg.content)
        if (result) cmd.execute(msg, result)
      }
    }

    // if default command type
    else {
      eventListener = (msg: Message) => {
        // if from bot, ignore
        if (msg.author.bot) return
        // if message is command, execute it
        if (cmd.test(msg)) cmd.execute(msg)
      }
    }

  // if got error, throw
  if (eventListener instanceof Error) {
    throw eventListener
  }

  // add event listener to client
  discordClient.on("message", eventListener)

  // add command to list
  state.commands.push({ command: cmd, id: cmd.id, eventListener })

}

export default CreateAddCommand
