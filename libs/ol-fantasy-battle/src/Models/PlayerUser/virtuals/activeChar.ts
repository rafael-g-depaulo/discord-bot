import { PcDocument } from "../../../Models/PlayerCharacter"
import { PlayerUserVirtualGetter } from "../types"

const get: PlayerUserVirtualGetter<PcDocument | null> = function(this) {
  if (this.activeCharIndex &&
    (!Number.isInteger(this.activeCharIndex) ||
    this.activeCharIndex < 0 ||
    this.activeCharIndex >= this.characters.length)
  ) throw new Error(`PlayerUserModel: this.activeCharIndex invalid value`)

  return this.activeCharIndex
    ? this.characters[this.activeCharIndex]
    : this.characters.length === 0
      ? null
      : this.characters[0]
}

export default { get }
