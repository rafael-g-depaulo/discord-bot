import { Command, RegexCommand } from "@discord-bot/create-client"
import { capture, concat, optionalSpace } from "@discord-bot/regex"

import { attributeNameRegex, PcDocument } from "../Models/PlayerCharacter"

import { commandWithFlags, dodgeWords, guardWords, setWords } from "../Utils/regex"
import parseFlags, { FlagsObject } from "../Utils/CommandStep/parseArgs"
import { logFailure, logSuccess } from "../Utils/commandLog"
import rejectIfNotPlayerOrDm from "../Utils/CommandStep/rejectIfNotPlayerOrDm"
import { getPlayerUser } from "../Utils/CommandStep/getUser"
import getPlayerChar from "../Utils/CommandStep/getPlayerChar"

// parse arguments
const flagsObject: FlagsObject<{
  player: string,
  char: string,

  // non-attribute scaling
  level: number,
  bonus: number,
  base: number,

  // highest attributes
  "highest-physical": number,
  "highest-mental": number,
  "highest-social": number,
  "highest-special": number,

  // attributes
  agility:    number, fortitude:  number, might:      number, learning:  number,
  logic:      number, perception: number, will:       number, deception: number,
  persuasion: number, presence:   number, alteration: number, creation:  number,
  energy:     number, entropy:    number, influence:  number, movement:  number,
  prescience: number, protection: number,
}> = {
  player: { type: "string", optional: true },
  char: { type: "string", optional: true },

  // non-attribute scaling
  level: { type: "number", optional: true },
  bonus: { type: "number", optional: true },
  base:  { type: "number", optional: true },

  // highest attributes
  "highest-physical": { type: "number", optional: true },
  "highest-mental":   { type: "number", optional: true },
  "highest-social":   { type: "number", optional: true },
  "highest-special":  { type: "number", optional: true },

  // attributes
  agility:    { type: "number", optional: true }, fortitude:  { type: "number", optional: true },
  might:      { type: "number", optional: true }, learning:   { type: "number", optional: true },
  logic:      { type: "number", optional: true }, perception: { type: "number", optional: true },
  will:       { type: "number", optional: true }, deception:  { type: "number", optional: true },
  persuasion: { type: "number", optional: true }, presence:   { type: "number", optional: true },
  alteration: { type: "number", optional: true }, creation:   { type: "number", optional: true },
  energy:     { type: "number", optional: true }, entropy:    { type: "number", optional: true },
  influence:  { type: "number", optional: true }, movement:   { type: "number", optional: true },
  prescience: { type: "number", optional: true }, protection: { type: "number", optional: true },
}

export const test: RegexCommand.test = commandWithFlags(
  concat(setWords, optionalSpace, capture("guard", guardWords), optionalSpace, /scaling/),
  concat(setWords, optionalSpace, capture("dodge", dodgeWords), optionalSpace, /scaling/),
)

const updateScaling = (value: number | undefined, scalingObj: PcDocument["guardScaling"], scalingType: keyof PcDocument["hpScaling"]): string => {
  if (!value) return ""

  const oldScaling = scalingObj[scalingType]
  scalingObj[scalingType] = value
  return `\n\t${scalingType}: ${oldScaling} -> ${value}`
}

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  const flags = parseFlags("!setDefenseScaling", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return

  const { player } = await getPlayerUser("!setDefenseScaling", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!setDefenseScaling", player, message, flags)
  if (!character) return
  
  const defenseScalingObj = 
    regexResult.groups?.guard ? character.guardScaling :
    regexResult.groups?.dodge ? character.dodgeScaling : null

  if (defenseScalingObj === null) return
  
  const updatedScalingStr = ""
    // non-attribute scaling
    + updateScaling(flags.base,  defenseScalingObj, "base")
    + updateScaling(flags.bonus, defenseScalingObj, "bonus")
    + updateScaling(flags.level, defenseScalingObj, "level")
    // highest attributes
    + updateScaling(flags["highest-physical"], defenseScalingObj, "highestPhysical")
    + updateScaling(flags["highest-mental"],   defenseScalingObj, "highestMental")
    + updateScaling(flags["highest-social"],   defenseScalingObj, "highestSocial")
    + updateScaling(flags["highest-special"],  defenseScalingObj, "highestSpecial")
    // update attribute scaling
    + updateScaling(flags.agility,    defenseScalingObj, "Agility")
    + updateScaling(flags.fortitude,  defenseScalingObj, "Fortitude")
    + updateScaling(flags.might,      defenseScalingObj, "Might")
    + updateScaling(flags.learning,   defenseScalingObj, "Learning")
    + updateScaling(flags.logic,      defenseScalingObj, "Logic")
    + updateScaling(flags.perception, defenseScalingObj, "Perception")
    + updateScaling(flags.will,       defenseScalingObj, "Will")
    + updateScaling(flags.deception,  defenseScalingObj, "Deception")
    + updateScaling(flags.persuasion, defenseScalingObj, "Persuasion")
    + updateScaling(flags.presence,   defenseScalingObj, "Presence")
    + updateScaling(flags.alteration, defenseScalingObj, "Alteration")
    + updateScaling(flags.creation,   defenseScalingObj, "Creation")
    + updateScaling(flags.energy,     defenseScalingObj, "Energy")
    + updateScaling(flags.entropy,    defenseScalingObj, "Entropy")
    + updateScaling(flags.influence,  defenseScalingObj, "Influence")
    + updateScaling(flags.movement,   defenseScalingObj, "Movement")
    + updateScaling(flags.prescience, defenseScalingObj, "Prescience")
    + updateScaling(flags.protection, defenseScalingObj, "Protection")
  
  // if no change to scaling
  if (updatedScalingStr === "") {
    logFailure("!setDefenseScaling", "called command without any of the required flags", message, flags)
    return message.channel.send("Nothing changed, as you didn't specify any argument for scaling to change.")
  }

  // update defenses
  character.updateDefenses()
  await player.save()
  
  logSuccess("!setDefenseScaling", message, flags)
  const defenseBeingChanged = regexResult.groups?.dodge ? "Dodge" : "Guard"
  return message.channel.send(`Ok! I made the following changes to ${character.name}'s ${defenseBeingChanged} scaling:${updatedScalingStr}`)
}

export const setDefenseScaling: Command = {
  id: "Fantasy Battle: setDefenseScaling",
  test,
  execute,
}

export default setDefenseScaling
