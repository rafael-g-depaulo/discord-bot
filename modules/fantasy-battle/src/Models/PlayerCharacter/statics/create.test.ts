import { useDbConnection } from "Utils/mongoTest"

import create, { createPcProps } from "./create"
import PcModel from ".."

describe('PlayerCharacter.createCharacter()', () => {
  useDbConnection("PlayerCharacter_createCharacter")
  
  describe('dealing with bad props', () => {
    it('throws if no name given or "" given', () => {
      expect(() => create.call(PcModel, {} as createPcProps)).toThrowError(`Fantasy Battle: createCharacter(): name prop missing or empty`)
      expect(() => create.call(PcModel, { name: "" } as createPcProps)).toThrowError(`Fantasy Battle: createCharacter(): name prop missing or empty`)
    })
  })

  describe(`properties`, () => {
    it(`passes direct props`, () => {
      const pcProps: createPcProps = {
        name: "Ssaak",
        atkAttb: "Agility"
      }
      const character = create.call(PcModel, pcProps)
      expect(character.name).toBe("Ssaak")
      expect(character.defaultAtkAttb).toBe("Agility")
    })

    it(`creates empty attributes`, () => {
      const character = create.call(PcModel, { name: "Mellhot" })
      expect(character.attributes).toMatchObject({
        Agility:    { bonus: 0, value: 0 }, Fortitude:  { bonus: 0, value: 0 },
        Might:      { bonus: 0, value: 0 }, Learning:   { bonus: 0, value: 0 },
        Logic:      { bonus: 0, value: 0 }, Perception: { bonus: 0, value: 0 },
        Will:       { bonus: 0, value: 0 }, Deception:  { bonus: 0, value: 0 },
        Persuasion: { bonus: 0, value: 0 }, Presence:   { bonus: 0, value: 0 },
        Alteration: { bonus: 0, value: 0 }, Creation:   { bonus: 0, value: 0 },
        Energy:     { bonus: 0, value: 0 }, Entropy:    { bonus: 0, value: 0 },
        Influence:  { bonus: 0, value: 0 }, Movement:   { bonus: 0, value: 0 },
        Prescience: { bonus: 0, value: 0 }, Protection: { bonus: 0, value: 0 },
      })
      expect(character.defaultAtkAttb).toBe("Might")
    })

    it(`has functioning attributes`, () => {
      const char = create.call(PcModel, { name: "Horu" })

      const agility0SkillRoll = char.rollAttribute("Agility")
      const agility0DmgRoll = char.rollDmg("Agility")

      char.attributes.Agility.bonus = 4
      char.attributes.Agility.value = 1

      const agility3SkillRoll = char.rollAttribute("Agility")
      const agility3DmgRoll = char.rollDmg("Agility")

      expect(agility0SkillRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1, bonus: 0 }))
      expect(agility0DmgRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 2, dieAmmount: 1, bonus: 0 }))
      
      expect(agility3SkillRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1, bonus: 10 }))
      expect(agility3DmgRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 6, dieAmmount: 2, bonus: 0 }))
    })
  })
})
