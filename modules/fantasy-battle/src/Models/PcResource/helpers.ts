import { Attribute, Pc, PcDocument } from "../PlayerCharacter/types"
import { Resource } from "./types"

export const mockResource = (): Resource => ({
  base_max: 0,
  bonus_max: 0,
  current: 0,
  temporary: 0,
})

// defaults set in Models/PlayerCharacter/Schema, as the default values.
// for hp:
//   - base: 8
//   - level: 2
//   - Fortitude: 2
//   - Might: 1.5
//   - Will: 1
//   - Presence: 1.5
// for mp:
//   - base: 8
//   - level: 2
//   - Learning: 2
//   - Logic: 1.5
//   - Will: 1
//   - highestSpecial: 1.5
export const getMaxHp = ({
  hpScaling,
  level,
  attributes,
  highestPhysical,
  highestMental,
  highestSocial,
  highestSpecial,
}: PcDocument): number => {
  const maxHp = hpScaling.base
    + hpScaling.bonus
    + hpScaling.level * level
    
    + hpScaling.Agility    * attributes.Agility   .value
    + hpScaling.Fortitude  * attributes.Fortitude .value
    + hpScaling.Might      * attributes.Might     .value

    + hpScaling.Learning   * attributes.Learning  .value
    + hpScaling.Logic      * attributes.Logic     .value
    + hpScaling.Perception * attributes.Perception.value
    + hpScaling.Will       * attributes.Will      .value
    
    + hpScaling.Deception  * attributes.Deception .value
    + hpScaling.Persuasion * attributes.Persuasion.value
    + hpScaling.Presence   * attributes.Presence  .value
    
    + hpScaling.Alteration * attributes.Alteration.value
    + hpScaling.Creation   * attributes.Creation  .value
    + hpScaling.Energy     * attributes.Energy    .value
    + hpScaling.Entropy    * attributes.Entropy   .value
    + hpScaling.Influence  * attributes.Influence .value
    + hpScaling.Movement   * attributes.Movement  .value
    + hpScaling.Prescience * attributes.Prescience.value
    + hpScaling.Protection * attributes.Protection.value

    + hpScaling.highestPhysical * highestPhysical .value
    + hpScaling.highestMental   * highestMental   .value
    + hpScaling.highestSocial   * highestSocial   .value
    + hpScaling.highestSpecial  * highestSpecial  .value
  return maxHp
}

export const getMaxMp = ({
  mpScaling,
  level,
  attributes,
  highestPhysical,
  highestMental,
  highestSocial,
  highestSpecial,
  name
}: PcDocument): number => {
  const maxMp = 
    + mpScaling.base
    + mpScaling.bonus
    + mpScaling.level * level
    + mpScaling.Agility    * attributes.Agility   .value
    + mpScaling.Fortitude  * attributes.Fortitude .value
    + mpScaling.Might      * attributes.Might     .value
    
    + mpScaling.Learning   * attributes.Learning  .value
    + mpScaling.Logic      * attributes.Logic     .value
    + mpScaling.Perception * attributes.Perception.value
    + mpScaling.Will       * attributes.Will      .value
    
    + mpScaling.Deception  * attributes.Deception .value
    + mpScaling.Persuasion * attributes.Persuasion.value
    + mpScaling.Presence   * attributes.Presence  .value

    + mpScaling.Alteration * attributes.Alteration.value
    + mpScaling.Creation   * attributes.Creation  .value
    + mpScaling.Energy     * attributes.Energy    .value
    + mpScaling.Entropy    * attributes.Entropy   .value
    + mpScaling.Influence  * attributes.Influence .value
    + mpScaling.Movement   * attributes.Movement  .value
    + mpScaling.Prescience * attributes.Prescience.value
    + mpScaling.Protection * attributes.Protection.value

    + mpScaling.highestPhysical * highestPhysical .value
    + mpScaling.highestMental   * highestMental   .value
    + mpScaling.highestSocial   * highestSocial   .value
    + mpScaling.highestSpecial  * highestSpecial  .value
  return maxMp
}
