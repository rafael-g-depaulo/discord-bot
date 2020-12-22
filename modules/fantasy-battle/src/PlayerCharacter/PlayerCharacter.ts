import { PcDocument } from "../Models/PlayerCharacter"
import { Attribute, AttributeNames, Attributes } from "./Attribute"

export interface PlayerCharacter {
  // actually important attributes
  name: string,
  attributes: {
    [key in AttributeNames]: Attribute
  },
  
  // model representation for character
  model: PcDocument,

  // method to save the character
  save: () => Promise<PcDocument>,
}

export interface PlayerCharacterState {
  name: string,
  model: PcDocument,
  attributes: Attributes,
}

export default PlayerCharacter
