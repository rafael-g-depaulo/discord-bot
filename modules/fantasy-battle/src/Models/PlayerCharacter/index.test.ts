import { useDbConnection } from "Utils/mongoTest"
import PcModel, { Pc } from "./index"

const mockAttributes = () => ({
  Agility    : { value: 0, bonus: 0 },
  Fortitude  : { value: 0, bonus: 0 },
  Might      : { value: 0, bonus: 0 },
  Learning   : { value: 0, bonus: 0 },
  Logic      : { value: 0, bonus: 0 },
  Perception : { value: 0, bonus: 0 },
  Will       : { value: 0, bonus: 0 },
  Deception  : { value: 0, bonus: 0 },
  Persuasion : { value: 0, bonus: 0 },
  Presence   : { value: 0, bonus: 0 },
  Alteration : { value: 0, bonus: 0 },
  Creation   : { value: 0, bonus: 0 },
  Energy     : { value: 0, bonus: 0 },
  Entropy    : { value: 0, bonus: 0 },
  Influence  : { value: 0, bonus: 0 },
  Movement   : { value: 0, bonus: 0 },
  Prescience : { value: 0, bonus: 0 },
  Protection : { value: 0, bonus: 0 },
})

describe("PlayerCharacter Model", () => {

  useDbConnection("PlayerCharacter")

  const pcInfo: Pc = {
    name: "character name",
    attributes: mockAttributes(),
  }
  describe("CRUD", () => {
    it("creates", async () => {
      const pc = new PcModel(pcInfo)
      const pcSaved = await pc.save()

      expect(pc.name).toBe(pcInfo.name)
      expect(pc._id).toStrictEqual(pcSaved?._id)
      expect(pc.name).toBe(pcSaved.name)
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

})
