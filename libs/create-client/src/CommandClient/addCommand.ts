import { Command, CommandProps, isRegexCommand } from "./index"

export const CreateAddCommand = (props: CommandProps) => (cmd: Command) => {
  const { commands = [], discordClient } = props

  // add command to list
  commands.push(cmd)

  // if is a regex-style command
  if (isRegexCommand(cmd)) {

    discordClient.on("message", msg => {
      // if from bot, ignore
      if (msg.author.bot) return
      // if message is command, execute it
      const commandRegex = cmd.test
      const result = commandRegex.exec(msg.content)
      if (result) cmd.execute(msg, result)
    })
  }

  // if default command type
  else {
    discordClient.on("message", msg => {
      // if from bot, ignore
      if (msg.author.bot) return
      // if message is command, execute it
      if (cmd.test(msg)) cmd.execute(msg)
    })
  }
}

export default CreateAddCommand
