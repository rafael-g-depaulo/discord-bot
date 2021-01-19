import { ResourceDocument } from "@discord-bot/ol-fantasy-battle/dist/Models/PcResource"
import { Attribute, PcDocument } from "@discord-bot/ol-fantasy-battle/dist/Models/PlayerCharacter"

export const monoSpaced = (str: string) => "```\n" + str + "```"

export const indexAfterSubstr = (str: string, subst: string) => str
  .slice(str.indexOf(subst) + subst.length)

export const bonusString = (bonus: number) => 
  bonus > 0 ? ` (+${bonus})` :
  bonus < 0 ? ` (${bonus})` :
  ""

export const defensesString = (char: PcDocument) =>
  `\nGuard: ${char.guard.value}${bonusString(char.guard.bonus)}   Dodge: ${char.dodge.value}${bonusString(char.dodge.bonus)}`

export const resourceString = (name: string, resource: ResourceDocument) =>
  `\n${name}:   **${resource.current}/${resource.max}**`

export const attributeGroupString = (name: string) => `\n\n**${name}**:`
export const attributeString = (attbName: string, attb: Attribute) =>
  `\n\t${attbName}: ${attb.value}${bonusString(attb.bonus)}`
