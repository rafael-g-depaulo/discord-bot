import { Command, RegexCommand } from "@discord-bot/create-client"
import { concat, nonCapture, optionalSpace, or } from "@discord-bot/regex"

import PcModel from "@discord-bot/ol-fantasy-battle/dist/Models/PlayerCharacter"
import DefenseModel from "@discord-bot/ol-fantasy-battle/dist/Models/PcDefense"
import ResourceModel from "@discord-bot/ol-fantasy-battle/dist/Models/PcResource"
import PlayerUserModel, { isPlayerUser } from "@discord-bot/ol-fantasy-battle/dist/Models/PlayerUser"

import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import { logFailure, logSuccess } from "../Utils/commandLog"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { getObjectData } from "../Utils/playerUserBackup"

export const test: RegexCommand.test = commandWithFlags(
  concat(/restore/, nonCapture(or(/-/, optionalSpace)), /backup/)
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, force: boolean }> = {
    player: { type: "string", optional: true },
    force: { type: "boolean", optional: true },
  }
  const flags = parseFlags("!restoreBackup", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!restoreBackup", message, flags.player)
  if (player === null) return

  // if no attached JSON file
  const attatchment = message.attachments.first()
  if (!attatchment || !/\.json$/.test(attatchment.url)) {
    logFailure("!restoreBackup", "message didn't include necessary attachment", message, flags)
    return message.channel.send(`There is no JSON backup file attached to your message. Send the backup file with the message "!restoreBackup"`)
  }

  try {
    const data = await getObjectData(attatchment)
    const dataObj = JSON.parse(data.toString())
    if (!isPlayerUser(dataObj)) throw new Error("Retrieved data isn't a valid PlayerUser instance")

    const playerId = dataObj.userId

    // if overriding existing user, and no --force flag present
    const existingUser = await PlayerUserModel.getUser(playerId)
    if (existingUser && !flags.force) {
      logFailure("!restoreBackup", "user tried to override existing player without --force flag", message, flags)
      return message.channel.send(`A user with the discord id ${playerId} already exists in my database (${existingUser.username}). If you want to override that existing entry use the --force flag`)
    }

    // delete old user if it exists, create and save new one
    if (existingUser) await existingUser.delete()
    const newPlayerUser = new PlayerUserModel(dataObj)
    newPlayerUser.characters = []
    dataObj.characters.forEach(char => {
      delete char._id
      delete char.hp._id
      delete char.mp._id
      delete char.guard._id
      delete char.dodge._id

      const charDoc = new PcModel(char)
      charDoc.hp = new ResourceModel(char.hp)
      charDoc.mp = new ResourceModel(char.mp)
      charDoc.guard = new DefenseModel(char.guard)
      charDoc.dodge = new DefenseModel(char.dodge)

      newPlayerUser.characters.push(charDoc)
    })
    await newPlayerUser.save({ checkKeys: true })

    logSuccess("!restoreBackup", message, flags)
    message.channel.send(`Ok! Given backup for ${newPlayerUser.username} was restored and saved to my database. (They have ${newPlayerUser.characters.length} character${newPlayerUser.characters.length !== 1 ? "s" : ""})`)
  } catch (err) {
    logFailure("!restoreBackup", `failed with ${err}`, message, flags)
    message.channel.send(`Something wen't wrong when i was trying to restore your backup`)
  }
  return
}

export const restoreBackupCommand: Command = {
  id: "Fantasy Battle: restoreBackup",
  test,
  execute,
}

export default restoreBackupCommand
