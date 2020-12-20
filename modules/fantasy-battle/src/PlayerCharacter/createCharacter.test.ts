import { createCharacter, PlayerCharacterProps } from "./createCharacter"

describe('createCharacter()', () => {
  
  describe('dealing with bad props', () => {
    it('throws if no name given or "" given', () => {
      expect(() => createCharacter({} as PlayerCharacterProps)).toThrowError(`Fantasy Battle: createCharacter(): name prop missing or empty`)
      expect(() => createCharacter({ name: "" } as PlayerCharacterProps)).toThrowError(`Fantasy Battle: createCharacter(): name prop missing or empty`)
    })
  })

  describe(`properties`, () => {
    it(`passes direct props`, () => {
      const pcProps: PlayerCharacterProps = {
        name: "Ssaak",
      }
      const character = createCharacter(pcProps)
      expect(character.name).toBe("Ssaak")
    })

    it(`creates empty attributes`, () => {
      const character = createCharacter({ name: "Mellhot" })
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
    })

    it(`has functioning attributes`, () => {
      const char = createCharacter({ name: "Horu" })

      const agility0SkillRoll = char.attributes.Agility.rollAttribute()
      const agility0DmgRoll = char.attributes.Agility.rollDmg()

      char.attributes.Agility.bonus = 4
      char.attributes.Agility.value = 1

      const agility3SkillRoll = char.attributes.Agility.rollAttribute()
      const agility3DmgRoll = char.attributes.Agility.rollDmg()

      expect(agility0SkillRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1, bonus: 0 }))
      expect(agility0DmgRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 2, dieAmmount: 1, bonus: 0 }))
      
      expect(agility3SkillRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1, bonus: 10 }))
      expect(agility3DmgRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 6, dieAmmount: 2, bonus: 0 }))
    })
  })
})
