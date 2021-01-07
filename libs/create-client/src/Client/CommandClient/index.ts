import { Composable } from "../../Composer"
import CreateAddCommand from "./addCommand"
import { resetMasterMessageListener } from "./helpers"
import CreateRemoveCommand from "./removeCommand"
import { CommandClient, CommandListener, CommandProps, CommandState } from "./types"

export {
  isDefaultCommand,
  isRegexCommand,
} from "./helpers"

export {
  // command
  Command,
  // client
  CommandClient,
  CommandProps,
  // commands
  DefaultCommand,
  RegexCommand,
} from "./types"

export const CreateCommandClient: Composable<CommandProps, CommandClient> = (props) => {
  
  const {
    commands: commandsProp = [],
  } = props

  const state: CommandState = {
    commandListeners: new Map<string, CommandListener>(),
  }
  
  // create addCommand
  const addCommand = CreateAddCommand(props, state)
  
  // create removeCommand
  const removeCommand = CreateRemoveCommand(props, state)

  // create master message listener
  resetMasterMessageListener(props, state)

  // add all prop commands to client
  commandsProp.forEach(addCommand)

  return {
    addCommand,
    removeCommand,
  }
}
