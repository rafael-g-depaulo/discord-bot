import { Command, RegexCommand } from "@discord-bot/create-client"

import { ResourceDocument } from "../Models/PcResource"
import { Attribute } from "../Models/PlayerCharacter/types"

import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { commandWithFlags } from "../Utils/regex"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import { logSuccess } from "../Utils/commandLog"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"

export const test: RegexCommand.test = commandWithFlags(
  /bio/,
)

const bonusString = (bonus: number) => 
  bonus > 0 ? ` (+${bonus})` :
  bonus < 0 ? ` (${bonus})` :
  ""

const resourceString = (name: string, resource: ResourceDocument) =>
  `\n${name}:   **${resource.current}/${resource.max}**`

const attributeGroupString = (name: string) => `\n\n**${name}**:`
const attributeString = (attbName: string, attb: Attribute) =>
  `\n\t${attbName}: ${attb.value}${bonusString(attb.bonus)}`

export const execute: RegexCommand.execute = async (message, regexResult) => {
  
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  // parse arguments
  const flagsObject: FlagsObject<{ player: string, char: string }> = {
    player: { type: "string", optional: true },
    char: { type: "string", optional: true },
  }
  const flags = parseFlags("!bio", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return
  
  const { player } = await getPlayerUser("!bio", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!bio", player, message, flags)
  if (!character) return

  const bioString = `**${character.name}** (level ${character.level})\n`
    + resourceString("HP", character.hp)
    + resourceString("MP", character.mp)

    + attributeGroupString("Physical")
    + attributeString("Agility"    , character.attributes.Agility)
    + attributeString("Fortitude"  , character.attributes.Fortitude)
    + attributeString("Might"      , character.attributes.Might)

    + attributeGroupString("Mental")
    + attributeString("Learning"   , character.attributes.Learning)
    + attributeString("Logic"      , character.attributes.Logic)
    + attributeString("Perception" , character.attributes.Perception)
    + attributeString("Will"       , character.attributes.Will)

    + attributeGroupString("Social")
    + attributeString("Deception"  , character.attributes.Deception)
    + attributeString("Persuasion" , character.attributes.Persuasion)
    + attributeString("Presence"   , character.attributes.Presence)

    + attributeGroupString("Special")
    + attributeString("Alteration" , character.attributes.Alteration)
    + attributeString("Creation"   , character.attributes.Creation)
    + attributeString("Energy"     , character.attributes.Energy)
    + attributeString("Entropy"    , character.attributes.Entropy)
    + attributeString("Influence"  , character.attributes.Influence)
    + attributeString("Movement"   , character.attributes.Movement)
    + attributeString("Prescience" , character.attributes.Prescience)
    + attributeString("Protection" , character.attributes.Protection)

  logSuccess("!bio", message, flags)
  message.channel.send(bioString)
}

export const bio: Command = {
  id: "Fantasy Battle: bio",
  test,
  execute,
}

export default bio
