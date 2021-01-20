import { useDbConnection } from "@discord-bot/mongo"

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

  describe("attributes", () => {
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

  
  describe("resources", () => {
    it(`creates empty resources`, () => {
      const character = create.call(PcModel, { name: "Mellhot" })
      expect(character.hp.max).toBe(10)
      expect(character.hp.current).toBe(10)

      expect(character.mp.max).toBe(10)
      expect(character.mp.current).toBe(10)
    })
  
    it(`creates empty resource scaling`, () => {
      const character = create.call(PcModel, { name: "Mellhot" })
      // default level
      expect(character.level).toBe(1)

      // hp scaling
      expect(character.hpScaling.base)     .toBe(8)
      expect(character.hpScaling.level)    .toBe(2)
      expect(character.hpScaling.bonus)    .toBe(0)
      expect(character.hpScaling.Fortitude).toBe(2)
      expect(character.hpScaling.Might)    .toBe(1.5)
      expect(character.hpScaling.Will)     .toBe(1)
      expect(character.hpScaling.Presence) .toBe(1.5)

      // mp scaling
      expect(character.mpScaling.base)          .toBe(8)
      expect(character.mpScaling.level)         .toBe(2)
      expect(character.mpScaling.bonus)         .toBe(0)
      expect(character.mpScaling.Learning)      .toBe(2)
      expect(character.mpScaling.Logic)         .toBe(1.5)
      expect(character.mpScaling.Will)          .toBe(1)
      expect(character.mpScaling.highestSpecial).toBe(1.5)
    })

    it('has the correct default hp and mp attributes', () => {
      const char = create.call(PcModel, { name: "Horu" })
      expect(char.hpDiceAttb).toBe("Fortitude")
      expect(char.mpDiceAttb).toBe("Learning")
    })

    it('accepts new hp/mp attributes', () => {
      const char = create.call(PcModel, { name: "Horu", hpDiceAttb: "Might", mpDiceAttb: "Will" })
      expect(char.hpDiceAttb).toBe("Might")
      expect(char.mpDiceAttb).toBe("Will")
    })
  })

  describe("defenses", () => {
    it(`creates defenses`, () => {
      const character = create.call(PcModel, { name: "Mellhot" })
      expect(character.guard.value).toBe(0)
      expect(character.guard.bonus).toBe(0)
      expect(character.dodge.value).toBe(0)
      expect(character.dodge.bonus).toBe(0)
    })
    
    it(`creates empty defense scaling`, () => {
      const character = create.call(PcModel, { name: "Mellhot" })
      // guard scaling
      expect(character.guard.value)            .toBe(0)
      expect(character.guardScaling.level)     .toBe(0)
      expect(character.guardScaling.bonus)     .toBe(0)
      expect(character.guardScaling.Might)     .toBe(1)
      expect(character.guardScaling.Fortitude) .toBe(0.75)
      expect(character.guardScaling.Protection).toBe(0.5)

      // dodge scaling
      expect(character.dodge.value)            .toBe(0)
      expect(character.dodgeScaling.level)     .toBe(0)
      expect(character.dodgeScaling.bonus)     .toBe(0)
      expect(character.dodgeScaling.Deception) .toBe(1)
      expect(character.dodgeScaling.Agility)   .toBe(0.75)
      expect(character.dodgeScaling.Perception).toBe(0.5)
    })
  })

  describe(`properties`, () => {
    it(`passes direct props`, () => {
      const pcProps: createPcProps = {
        name: "Ssaak",
        atkAttb: "Agility",
        level: 3
      }
      const character = create.call(PcModel, pcProps)
      expect(character.name).toBe("Ssaak")
      expect(character.defaultAtkAttb).toBe("Agility")
      expect(character.level).toBe(3)
    })
  })
})
