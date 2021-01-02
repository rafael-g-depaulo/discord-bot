import { PcDocument } from "../../PlayerCharacter"
import { PlayerUserInstanceMethod } from "../types"

export interface getCharacter {
  (charName: string): PcDocument | null,
}

export const getCharacter: PlayerUserInstanceMethod<getCharacter> = function(this, charName) {
  const character = this.characters.find(char => char.name.toLowerCase().indexOf(charName.toLowerCase()) !== -1)
  return character ?? null
}

export default getCharacter
