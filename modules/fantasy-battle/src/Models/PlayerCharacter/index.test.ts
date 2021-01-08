import mockAttributes from "Utils/mockAttributes"
import { useDbConnection } from "Utils/mongoTest"
import PcModel, { Pc } from "./index"
import { createPcProps } from "./statics/create"

describe("PlayerCharacter Model", () => {

  useDbConnection("PlayerCharacter")

  const pcInfo: Pc = {
    name: "character name",
    attributes: mockAttributes(),
    defaultAtkAttb: "Agility",
  }
  describe("CRUD", () => {
    it("creates", async () => {
      const pc = new PcModel(pcInfo)
      const pcSaved = await pc.save()
      expect(pc.name).toBe(pcInfo.name)
      expect(pc._id).toStrictEqual(pcSaved?._id)
      expect(pc.name).toBe(pcSaved.name)
      expect(pc.defaultAtkAttb).toBe("Agility")

      // hp scaling
      expect(pc.hpScaling.base)      .toBe(8)
      expect(pc.hpScaling.level)     .toBe(2)
      expect(pc.hpScaling.bonus)     .toBe(0)
      expect(pc.hpScaling.Fortitude) .toBe(2)
      expect(pc.hpScaling.Might)     .toBe(1.5)
      expect(pc.hpScaling.Will)      .toBe(1)
      expect(pc.hpScaling.Presence)  .toBe(2)

      // mp scaling
      expect(pc.mpScaling.base)      .toBe(8)
      expect(pc.mpScaling.level)     .toBe(2)
      expect(pc.mpScaling.bonus)     .toBe(0)
      expect(pc.mpScaling.Learning)  .toBe(2)
      expect(pc.mpScaling.Logic)     .toBe(1.5)
      expect(pc.mpScaling.Will)      .toBe(1)
    })

    it("reads", async () => {
      const pc = new PcModel(pcInfo)
      await pc.save()

      const readPc = await PcModel.findById(pc._id)
      expect(pc._id).toStrictEqual(readPc?._id)
      expect(pc.name).toBe(readPc?.name)
    })
    
    it("updates", async () => {
      const pc = new PcModel(pcInfo)
      await pc.save()

      const read1 = await PcModel.findById(pc._id)

      pc.name = "new name"
      pc.attributes.Creation.value = 2
      pc.attributes.Creation.bonus = -1
      await pc.save()

      const read2 = await PcModel.findById(pc._id)
      expect(read1?.name).toEqual("character name")
      expect(read1?.attributes.Creation.value).toEqual(0)
      expect(read1?.attributes.Creation.bonus).toEqual(0)
      expect(read2?.name).toEqual("new name")
      expect(read2?.attributes.Creation.value).toEqual(2)
      expect(read2?.attributes.Creation.bonus).toEqual(-1)
    })
    
    it("deletes", async () => {
      const pc = new PcModel(pcInfo)
      await pc.save()

      const read = await PcModel.findById(pc._id)
      expect(read).not.toBe(null)

      await pc.delete()
      const deleted = await PcModel.findById(pc._id)
      expect(deleted).toBe(null)
    })
  })

  it('default props work', () => {
    const char = new PcModel({ name: "TestName", attributes: mockAttributes() })
    expect(char.defaultAtkAttb).toBe("Might")
  })

  describe("methods", () => {
    describe(".rollAttribute()", () => {
      it("works without bonus parameter", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        expect(mockedPc.rollAttribute("Agility").diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 0 }))
      })

      it("works with extra dice parameters", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        expect(mockedPc.rollAttribute("Agility", { bonus: 2 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 2 }))
        expect(mockedPc.rollAttribute("Agility", { bonus: -3, advantage: -4 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: -3, advantage: -4 }))
      })

      it("works with .value and .bonus", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        mockedPc.attributes.Agility.value = 3
        mockedPc.attributes.Agility.bonus = -4
        expect(mockedPc.rollAttribute("Agility", { bonus: -2 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: -4 }))
        expect(mockedPc.rollAttribute("Agility", { bonus: 3, advantage: 2 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 1, advantage: 2 }))
      })
    })
    
    describe(".rollDmg()", () => {
      it("works without bonus parameter", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        expect(mockedPc.rollDmg("Logic").diceArgs).toEqual(expect.objectContaining({ dieAmmount: 1, dieMax: 2 }))
      })

      it("works with bonus parameter", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        expect(mockedPc.rollDmg("Logic", { bonus: 2 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 1, dieMax: 6 }))
      })

      it("works for values below 0", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        mockedPc.attributes.Logic.value = 3
        mockedPc.attributes.Logic.bonus = -4
        expect(mockedPc.rollDmg("Logic", { bonus: -2, advantage: -3 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 1, dieMax: 2, advantage: -3 }))
      })

      it("works for values above 20", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        mockedPc.attributes.Logic.value = 13
        mockedPc.attributes.Logic.bonus = 5
        expect(mockedPc.rollDmg("Logic", { bonus: 3, explode: 88 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 10, dieMax: 10, explode: 9 }))
      })

      it("works for usual values (0 <= value <= 20)", () => {
        const mockedPc = PcModel.createCharacter({ name: "Horu" })
        mockedPc.attributes.Logic.value = 7
        mockedPc.attributes.Logic.bonus = -2
        mockedPc.attributes.Energy.value = 6
        mockedPc.attributes.Energy.bonus = -4
        mockedPc.attributes.Might.value = -2
        mockedPc.attributes.Might.bonus = 7

        expect(mockedPc.rollDmg("Logic", { bonus: -2, explode: 99 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 1, dieMax:  8, explode: 7 }))
        expect(mockedPc.rollDmg("Energy"   ).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 1, dieMax:  6 }))
        expect(mockedPc.rollDmg("Might", { bonus: +5, advantage: -3}).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 4, dieMax: 10, advantage: -3 }))
      })
    })
  })

  describe("statics", () => {
    describe(".createCharacter()", () => {
      it('throws if bad props', () => {
        expect(() => PcModel.createCharacter({} as createPcProps)).toThrowError(`Fantasy Battle: createCharacter(): name prop missing or empty`)
        expect(() => PcModel.createCharacter({ name: "" } as createPcProps)).toThrowError(`Fantasy Battle: createCharacter(): name prop missing or empty`)
      })

      describe(`properties`, () => {
        it(`passes direct props`, () => {
          const pcProps: createPcProps = {
            name: "Ssaak",
          }
          const character = PcModel.createCharacter(pcProps)
          expect(character.name).toBe("Ssaak")
        })

        it(`creates empty attributes`, () => {
          const character = PcModel.createCharacter({ name: "Mellhot" })
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
      })
    })
  })
})
