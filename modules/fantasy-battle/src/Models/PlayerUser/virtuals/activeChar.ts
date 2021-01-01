import { PcDocument } from "Models/PlayerCharacter"
import { PlayerUserVirtualGetter } from "../types"

const get: PlayerUserVirtualGetter<PcDocument | null> = function(this) {
  return this.activeCharIndex
    ? this.characters[this.activeCharIndex]
    : this.characters.length === 0
      ? null
      : this.characters[0]
}

export default { get }
