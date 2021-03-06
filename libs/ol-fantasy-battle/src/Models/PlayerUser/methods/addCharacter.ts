import { PcDocument } from "../../../Models/PlayerCharacter"
import { PlayerUserInstanceMethod } from "../types"

export interface addCharacter {
  (char: PcDocument): void,
}

export const addCharacter: PlayerUserInstanceMethod<addCharacter> = function(this, char) {
  this.characters.push(char)
  this.activeCharIndex = this.activeCharIndex ?? 0
}

export default addCharacter
