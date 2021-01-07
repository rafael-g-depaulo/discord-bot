import { PcDocument } from "../../../Models/PlayerCharacter"
import { PlayerUserInstanceMethod } from "../types"

export interface removeCharacter {
  (char: PcDocument): PcDocument | null,
}

export const removeCharacter: PlayerUserInstanceMethod<removeCharacter> = function(this, char) {
  const deletedCharId = this.characters.findIndex(pcChar => pcChar._id === char._id)

  // if character no found, do nothing and return null
  if (deletedCharId === -1) return null

  // remove character
  this.characters.splice(deletedCharId, 1)

  // if removed active character, reset activeChar
  if (deletedCharId === this.activeCharIndex) {
    this.activeCharIndex = this.characters.length === 0
      ? undefined
      : this.characters.length - 1
  }
  return char
}

export default removeCharacter
