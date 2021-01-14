import ResourceModel, { Resource } from "./index"

import { useDbConnection } from "@discord-bot/mongo"
import PcModel from "Models/PlayerCharacter"

describe("PcResource", () => {
  
  useDbConnection("PcResource")

  const hpProps: Resource = {
    base_max: 2,
    bonus_max: 1,
    current: 3,
    temporary: 0,
  }

  describe("CRUD", () => {
    it("creates", async () => {
      const hp = new ResourceModel(hpProps)
      expect(hp.max).toBe(3)  // virtual property
      expect(hp.base_max).toBe(2)
      expect(hp.current).toBe(3)
      expect(hp.temporary).toBe(0)
    })

    it("reads", async () => {
      // create and save
      const hp = new ResourceModel(hpProps)
      await hp.save()

      // read resource
      const readResource = await ResourceModel.findOne({ _id: hp._id })

      expect(readResource?.max).toBe(hp.max)
      expect(readResource?.current).toBe(hp.current)
      expect(readResource?._id).toStrictEqual(hp._id)
    })
    
    it("updates", async () => {
      const hp = new ResourceModel(hpProps)
      await hp.save()
      
      expect(hp?.max).toBe(3)
      expect(hp?.current).toBe(3)

      hp.current -= 2
      await hp.save()

      const readResource = await ResourceModel.findOne({ _id: hp._id })

      expect(readResource?.max).toBe(3)
      expect(readResource?.current).toBe(1)
    })
    
    it("deletes", async () => {
      const hp = new ResourceModel(hpProps)
      await hp.save()
      
      const fetchedResource = await ResourceModel.findOne({ _id: hp._id })
      expect(fetchedResource).not.toBe(null)

      await hp.deleteOne()
      
      const deletedResource = await ResourceModel.findOne({ _id: hp._id })
      expect(deletedResource).toBe(null)
    })
  })

  describe("virtuals", () => {
    describe(".max", () => {
      it("works", () => {
        const hp = new ResourceModel(hpProps)
        expect(hp.base_max).toBe(2)
        expect(hp.bonus_max).toBe(1)
        expect(hp.max).toBe(3)  // virtual property
        
        hp.bonus_max += 2
        hp.base_max -= 1
        
        expect(hp.base_max).toBe(1)
        expect(hp.bonus_max).toBe(3)
        expect(hp.max).toBe(4)  // virtual property
      })
    })
  })

  describe('statics', () => {
    describe('.createHp()', () => {
      it("works", () => {
        const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
        const hp1 = ResourceModel.createHp(pc1)
        expect(hp1.max).toBe(10)
        expect(hp1.base_max).toBe(10)
        expect(hp1.bonus_max).toBe(0)
        expect(hp1.current).toBe(10)
    
        const pc2 = PcModel.createCharacter({ name: "test", level: 1 })
        pc2.hpScaling.bonus = 3             // hp +3
        pc2.level += 2                      // hp +4
        pc2.attributes.Fortitude.value = 3  // hp +6
        const hp2 = ResourceModel.createHp(pc2)
        expect(hp2.max).toBe(23)
        expect(hp2.base_max).toBe(23)
        expect(hp2.bonus_max).toBe(0)
        expect(hp2.current).toBe(23)
      })
    })

    describe('.createMp()', () => {
      it("works", () => {
        const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
        const mp1 = ResourceModel.createMp(pc1)
        expect(mp1.max).toBe(10)
        expect(mp1.base_max).toBe(10)
        expect(mp1.bonus_max).toBe(0)
        expect(mp1.current).toBe(10)
    
        const pc2 = PcModel.createCharacter({ name: "test", level: 1 })
        pc2.mpScaling.bonus = 3             // mp +3
        pc2.mpScaling.Persuasion = 2        
        pc2.attributes.Persuasion.value = 3 // mp +6
        pc2.level += 2                      // mp +4
        pc2.attributes.Logic.value = 2      // mp +3
        pc2.attributes.Entropy.value = 4    // mp +6
        const mp2 = ResourceModel.createMp(pc2)
        expect(mp2.max).toBe(32)
        expect(mp2.base_max).toBe(32)
        expect(mp2.bonus_max).toBe(0)
        expect(mp2.current).toBe(32)
      })
    })
  })
})
