import { useDbConnection } from "Utils/mongoTest"
import PlayerCharacterModel, { PlayerCharacter } from "./index"

describe("PlayerCharacter Model", () => {

  useDbConnection("PlayerCharacter")

  const pcInfo: PlayerCharacter = {
    name: "character name"
  }
  describe("CRUD", () => {
    it("creates", async () => {
      const pc = new PlayerCharacterModel(pcInfo)
      const pcSaved = await pc.save()
      expect(pc.name).toBe(pcInfo.name)
      expect(pc._id).toStrictEqual(pcSaved?._id)
      expect(pc.name).toBe(pcSaved.name)
    })

    it("reads", async () => {
      const pc = new PlayerCharacterModel(pcInfo)
      await pc.save()

      const readPc = await PlayerCharacterModel.findById(pc._id)
      expect(pc._id).toStrictEqual(readPc?._id)
      expect(pc.name).toBe(readPc?.name)
    })
    
    it("updates", async () => {
      const pc = new PlayerCharacterModel(pcInfo)
      await pc.save()

      const read1 = await PlayerCharacterModel.findById(pc._id)
      pc.name = "new name"
      await pc.save()

      const read2 = await PlayerCharacterModel.findById(pc._id)
      expect(read1?.name).toEqual("character name")
      expect(read2?.name).toEqual("new name")
    })
    
    it("deletes", async () => {
      const pc = new PlayerCharacterModel(pcInfo)
      await pc.save()

      const read = await PlayerCharacterModel.findById(pc._id)
      expect(read).not.toBe(null)

      await pc.delete()
      const deleted = await PlayerCharacterModel.findById(pc._id)
      expect(deleted).toBe(null)
    })
  })

})
