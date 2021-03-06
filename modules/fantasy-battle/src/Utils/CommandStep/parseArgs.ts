import { Discord } from "@discord-bot/create-client"
import parseArgsStringToArgv from "string-argv"
import yargs from "yargs"
import logger from "../logger"

export type FlagTypeStr = "string" | "number" | "boolean"
export type FlagType = string | number | boolean

// single flag definition
export interface Flag<T extends FlagTypeStr> {
  optional?: boolean,
  type: T,
}

// map of flag name: type
export type FlagTypeMap = { [key: string]: FlagType }

// "flags definition object" type definition
export type FlagsObject<FlagInterface extends FlagTypeMap> = {
  [key in keyof FlagInterface]:
    FlagInterface[key] extends string  ? Flag<"string">  :
    FlagInterface[key] extends boolean ? Flag<"boolean"> :
    FlagInterface[key] extends number  ? Flag<"number">  : never
}

export const parseFlags = <FlagInterface extends FlagTypeMap> (
  commandName: string,
  flagsObject: FlagsObject<FlagInterface>,
  argsString: string = "",
  message: Discord.Message,
): Partial<FlagInterface> | null => {

  // parse arguments
  const argsArr = parseArgsStringToArgv(argsString)
  const argsRaw = yargs(argsArr).argv
  // make all flag names to be in loweCase
  const args = Object.fromEntries(Object
    .entries(argsRaw)
    .map(([key, value]) => [key.toLowerCase(), value])
  )

  let parsedFlags: Partial<FlagInterface> = {}
  const flagNames = Object.keys(flagsObject)
  for (const flagName of flagNames) {
    // const flag = getFlag(flagsObject, flagName, args)
    // flag doesn't exist in string and isn't optional
    if (!flagsObject[flagName].optional && args[flagName] === undefined) {
      logger.info(`FB: (Command) ${commandName}: user "${message.author.username}" forgot the --${flagName} flag`)
      message.channel.send(`"**${commandName}**": --${flagName} flag is necessary. Please include it and try again`)
      return null
    }
    // wrong arg types (don't allow if recied flag is undefined and flag is optional, though)
    else if (flagsObject[flagName].type !== typeof args[flagName] && !(flagsObject[flagName].optional && args[flagName] === undefined)) {
      logger.info(`FB: (Command) ${commandName}: user "${message.author.username}" gave the wrong type for flag --${flagName}. Expected ${flagsObject[flagName].type}, but received ${typeof args[flagName]}`)
      message.channel.send(`"**${commandName}**": wrong type for flag --${flagName}. Flag expects type ${flagsObject[flagName].type}, but received type ${typeof args[flagName]}`)
      return null
    }

    // add parsed flag to flag object
    parsedFlags = { ...parsedFlags, [flagName]: args[flagName] }
  }

  return parsedFlags
}

export default parseFlags
