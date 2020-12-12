import { Command, CommandProps, CommandState } from "./index"

export const CreateRemoveCommand = (props: CommandProps, state: CommandState) => (cmd: string | Command) => {
  const { discordClient } = props
  
  // get the event listener for the command
  const cmdId = typeof cmd === 'string'
    ? cmd
    : cmd.id

  const command = state.commands.find(c => c.id === cmdId)

  // if there is no event listener to remove, return
  if (!command?.eventListener) {
    console.log("WARNING: create-client: CommandClient.removeCommand: tried to remove command with empty event listener")
    return
  }
  
  // remove event listener
  discordClient.removeListener("message", command.eventListener)

  // remove command from state
  const removedCommandIndex = state.commands.findIndex(c => c.id === cmdId)
  state.commands.splice(removedCommandIndex, 1)
}

export default CreateRemoveCommand
