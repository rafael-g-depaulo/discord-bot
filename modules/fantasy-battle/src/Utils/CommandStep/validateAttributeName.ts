import { Discord } from "@discord-bot/create-client"

import { getAttributeByNickname } from "../../Models/PlayerCharacter/helpers/attributes"
// import { isAttributeName } from "../Models/PlayerCharacter/helpers"
import { AttributeName } from "../../Models/PlayerCharacter/types"

import { logFailure, Flags } from "../commandLog"

const validateAttributeName = (commandName: string, message: Discord.Message, flags: Flags, attributeFlagName: string): AttributeName | undefined | null => {
  const attributeNickname = flags[attributeFlagName]
  const attributeName = getAttributeByNickname(`${attributeNickname}`)

  if (attributeNickname !== undefined && attributeName === null) {
    logFailure(commandName, `value "${attributeNickname}" for --${attributeFlagName} flag is not a valid attribute name`, message, flags)
    message.channel.send(`value "${attributeNickname}" isn't a valid attribute name`)
    return null
  }
  // return undefined if attributeNickname nor specified
  // (this differentiates between not present attributes (undefined) and invalid attributes (null))
  return attributeName ?? undefined
}

export default validateAttributeName
