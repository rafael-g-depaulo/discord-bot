import is from "@sindresorhus/is"

import { Command, CommandState, RegexCommand, DefaultCommand } from "./CommandClient"

export const addCommand = (state: CommandState) => (cmd: Command) => {
  const { commands = [], discordClient } = state

  // add command to list
  commands.push(cmd)

  // if is a regex-style command
  if (is.regExp(cmd.test)) {

    discordClient.on("message", msg => {
      // assert command type
      const command = cmd as RegexCommand

      // if from bot, ignore
      if (msg.author.bot) return

      // if message is command, execute it
      const commandRegex = command.test
      const result = commandRegex.exec(msg.content)
      if (result) command.execute(msg, result)
    })
  }

  // if default command type
  else {
    discordClient.on("message", msg => {

      // assert command type
      const command = cmd as DefaultCommand

      // if from bot, ignore
      if (msg.author.bot) return
      // if message is command, execute it
      if (command.test(msg)) command.execute(msg)
    })
  }
}

export default addCommand
