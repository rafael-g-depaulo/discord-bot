import { Command, RegexCommand } from "@discord-bot/create-client"
import { capture, concat, optionalSpace } from "@discord-bot/regex"

import { PcDocument } from "../Models/PlayerCharacter"
import { hpRegex, mpRegex } from "../Models/PcResource"

import { commandWithFlags, setWords } from "../Utils/regex"
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
  concat(setWords, optionalSpace, capture("hp", hpRegex), optionalSpace, /scaling/),
  concat(setWords, optionalSpace, capture("mp", mpRegex), optionalSpace, /scaling/),
)

const updateScaling = (value: number | undefined, scalingObj: PcDocument["hpScaling"], scalingType: keyof PcDocument["hpScaling"]): string => {
  if (!value) return ""

  const oldScaling = scalingObj[scalingType]
  scalingObj[scalingType] = value
  return `\n\t${scalingType}: ${oldScaling} -> ${value}`
}

export const execute: RegexCommand.execute = async (message, regexResult) => {
  // if user isn't admin or Player or DM, ignore
  if (rejectIfNotPlayerOrDm(message)) return

  const flags = parseFlags("!setResourceScaling", flagsObject, regexResult?.groups?.flags, message)
  if (flags === null) return

  const { player } = await getPlayerUser("!setResourceScaling", message, flags.player)
  if (player === null) return

  const character = getPlayerChar("!setResourceScaling", player, message, flags)
  if (!character) return
  
  const resourceScalingObj = 
    regexResult.groups?.hp ? character.hpScaling :
    regexResult.groups?.mp ? character.mpScaling : null

  if (resourceScalingObj === null) return
  
  const updatedScalingStr = ""
    // non-attribute scaling
    + updateScaling(flags.base,  resourceScalingObj, "base")
    + updateScaling(flags.bonus, resourceScalingObj, "bonus")
    + updateScaling(flags.level, resourceScalingObj, "level")
    // highest attributes
    + updateScaling(flags["highest-physical"], resourceScalingObj, "highestPhysical")
    + updateScaling(flags["highest-mental"],   resourceScalingObj, "highestMental")
    + updateScaling(flags["highest-social"],   resourceScalingObj, "highestSocial")
    + updateScaling(flags["highest-special"],  resourceScalingObj, "highestSpecial")
    // update attribute scaling
    + updateScaling(flags.agility,    resourceScalingObj, "Agility")
    + updateScaling(flags.fortitude,  resourceScalingObj, "Fortitude")
    + updateScaling(flags.might,      resourceScalingObj, "Might")
    + updateScaling(flags.learning,   resourceScalingObj, "Learning")
    + updateScaling(flags.logic,      resourceScalingObj, "Logic")
    + updateScaling(flags.perception, resourceScalingObj, "Perception")
    + updateScaling(flags.will,       resourceScalingObj, "Will")
    + updateScaling(flags.deception,  resourceScalingObj, "Deception")
    + updateScaling(flags.persuasion, resourceScalingObj, "Persuasion")
    + updateScaling(flags.presence,   resourceScalingObj, "Presence")
    + updateScaling(flags.alteration, resourceScalingObj, "Alteration")
    + updateScaling(flags.creation,   resourceScalingObj, "Creation")
    + updateScaling(flags.energy,     resourceScalingObj, "Energy")
    + updateScaling(flags.entropy,    resourceScalingObj, "Entropy")
    + updateScaling(flags.influence,  resourceScalingObj, "Influence")
    + updateScaling(flags.movement,   resourceScalingObj, "Movement")
    + updateScaling(flags.prescience, resourceScalingObj, "Prescience")
    + updateScaling(flags.protection, resourceScalingObj, "Protection")
  
  // if no change to scaling
  if (updatedScalingStr === "") {
    logFailure("!setResourceScaling", "called command without any of the required flags", message, flags)
    return message.channel.send("Nothing changed, as you didn't specify any argument for scaling to change.")
  }

  // update resources
  character.updateMaxResources()
  await player.save()
  
  logSuccess("!setResourceScaling", message, flags)
  const resourceBeingChanged = regexResult.groups?.mp ? "MP" : "HP"
  return message.channel.send(`Ok! I made the following changes to ${character.name}'s ${resourceBeingChanged} scaling:${updatedScalingStr}`)
}

export const setResourceScaling: Command = {
  id: "Fantasy Battle: setResourceScaling",
  test,
  execute,
}

export default setResourceScaling
