import { Command, RegexCommand } from "@discord-bot/create-client"
import { concat, nonCapture, optionalSpace, or } from "@discord-bot/regex"

import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { createBackup } from "../Utils/playerUserBackup"
import { logFailure, logSuccess } from "../Utils/commandLog"

export const test: RegexCommand.test = commandWithFlags(
  concat(/create/, nonCapture(or(/-/, optionalSpace)), /backup/)
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string }> = {
    player: { type: "string", optional: true },
  }
  const flags = parseFlags("!createBackup", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!createBackup", message, flags.player)
  if (player === null) return

  createBackup(player)
    .then(file => {
      logSuccess("!createBackup", message, flags)
      message.channel.send("Ok! here's your backup. please keep it safe somewhere (my database might explode anytime :c)", { files: [file] })
    })
    .catch(err => {
      logFailure("!createBackup", `error when creating temp file: ${err}`, message, flags)
      return message.channel.send(`oops, something wen't wrong when i was creating your JSON file backup`)
    })
}

export const createBackupCommand: Command = {
  id: "Fantasy Battle: createBackup",
  test,
  execute,
}

export default createBackupCommand
