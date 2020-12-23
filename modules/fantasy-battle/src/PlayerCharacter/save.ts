import { AttributeNames, AttributeProperties } from "./Attribute"
import { PlayerCharacterState } from "./PlayerCharacter"

export const saveFactory = (state: PlayerCharacterState) => () => {
  // get info from current state
  const {
    name,
    model,
    attributes,
  } = state

  // update model with current state
  model.name = name
  // update attributes
  model.attributes.Agility    = attributes.Agility
  model.attributes.Fortitude  = attributes.Fortitude
  model.attributes.Might      = attributes.Might
  model.attributes.Learning   = attributes.Learning
  model.attributes.Logic      = attributes.Logic
  model.attributes.Perception = attributes.Perception
  model.attributes.Will       = attributes.Will
  model.attributes.Deception  = attributes.Deception
  model.attributes.Persuasion = attributes.Persuasion
  model.attributes.Presence   = attributes.Presence
  model.attributes.Alteration = attributes.Alteration
  model.attributes.Creation   = attributes.Creation
  model.attributes.Energy     = attributes.Energy
  model.attributes.Entropy    = attributes.Entropy
  model.attributes.Influence  = attributes.Influence
  model.attributes.Movement   = attributes.Movement
  model.attributes.Prescience = attributes.Prescience
  model.attributes.Protection = attributes.Protection

  // save
  return model.save()
}
