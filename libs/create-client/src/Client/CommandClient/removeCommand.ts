// import { resetMasterMessageListener } from "./helpers"
import { Command, CommandProps } from "./index"
import { CommandState } from "./types"

export const CreateRemoveCommand = (props: CommandProps, state: CommandState) => (cmd: string | Command) => {
  if (typeof cmd === 'string')
    state.commandListeners.delete(cmd)
  else state.commandListeners.delete(cmd.id)
  
  // re-create message listener to stop using old command
  // (apperently isn't needed as the listener properly uses the current map, and doesn't need the referece to be reset)
  // resetMasterMessageListener(props, state)
}

export default CreateRemoveCommand
