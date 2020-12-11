import { Command, CommandProps, CommandState } from "./index"

export const CreateRemoveCommand = (props: CommandProps, state: CommandState) => (cmd: Command) => {
  // const { discordClient } = props
  cmd
  state
  props

}

export default CreateRemoveCommand
