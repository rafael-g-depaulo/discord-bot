import { Message } from "discord.js"
import { Command, CommandListener, CommandProps, CommandState } from "./types"
import { isRegexCommand } from "./helpers"

export const CreateAddCommand = (props: CommandProps, state: CommandState) => (cmd: Command) => {
  const {
    commandListeners,
  } = state

  // create and add event listener
  let eventListener: undefined | CommandListener

  // if is a regex-style command
  if (isRegexCommand(cmd)) {
    eventListener = {
      test: (msg: Message) => cmd.test.test(msg.content),
      execute: async (msg: Message) => await cmd.execute(msg, cmd.test.exec(msg.content)!)
    }
  }
  // if default command type
  else {
    eventListener = {
      test: (msg: Message) => cmd.test(msg),
      execute: async (msg: Message) => await cmd.execute(msg)
    }
  }

  // add event listener to map
  commandListeners.set(cmd.id, eventListener)

  // re-create message listener to reflect new command
  // (apperently isn't needed as the listener properly uses the current map, and doesn't need the referece to be reset)
  // resetMasterMessageListener(props, state)
}

export default CreateAddCommand
