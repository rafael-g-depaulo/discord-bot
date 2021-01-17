import DefenseModel, { Defense } from "./index"

import { useDbConnection } from "@discord-bot/mongo"
import PcModel from "Models/PlayerCharacter"

describe("PcDefense", () => {
  
  useDbConnection("PcDefense")

  const guardProps: Defense = {
    value: 3,
    bonus: -1,
  }

  describe("CRUD", () => {
    it("creates", async () => {
      const guard = new DefenseModel(guardProps)
      expect(guard.value).toBe(3)  // virtual property
      expect(guard.bonus).toBe(-1)
    })

    it("reads", async () => {
      // create and save
      const guard = new DefenseModel(guardProps)
      await guard.save()

      // read resource
      const readDefense = await DefenseModel.findOne({ _id: guard._id })

      expect(readDefense?.value).toBe(guard.value)
      expect(readDefense?.bonus).toBe(guard.bonus)
    })
    
    it("updates", async () => {
      const guard = new DefenseModel(guardProps)
      await guard.save()
      
      expect(guard?.value).toBe(3)
      expect(guard?.bonus).toBe(-1)

      guard.bonus -= 2
      await guard.save()

      const readDefense = await DefenseModel.findOne({ _id: guard._id })

      expect(readDefense?.value).toBe(3)
      expect(readDefense?.bonus).toBe(-3)
    })
    
    it("deletes", async () => {
      const guard = new DefenseModel(guardProps)
      await guard.save()
      
      const fetchedDefense = await DefenseModel.findOne({ _id: guard._id })
      expect(fetchedDefense).not.toBe(null)

      await guard.deleteOne()
      
      const deletedDefense = await DefenseModel.findOne({ _id: guard._id })
      expect(deletedDefense).toBe(null)
    })
  })

  describe("virtuals", () => {
    describe(".total", () => {
      it("works", () => {
        const guard = new DefenseModel(guardProps)
        expect(guard.value).toBe(3)
        expect(guard.bonus).toBe(-1)
        expect(guard.total).toBe(2)  // virtual property
        
        guard.value += 2
        guard.bonus -= 1
        
        expect(guard.value).toBe(5)
        expect(guard.bonus).toBe(-2)
        expect(guard.total).toBe(3)  // virtual property
      })
    })
  })

  describe('statics', () => {
    describe('.createGuard()', () => {
      it("works", () => {
        const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
        const guard1 = DefenseModel.createGuard(pc1)
        expect(guard1.value).toBe(0)
        expect(guard1.bonus).toBe(0)
        
        const pc2 = PcModel.createCharacter({ name: "Kastun", level: 3 })
        pc2.guardScaling.bonus = 1
        pc2.attributes.Fortitude.value = 3
        pc2.attributes.Might.value = 5
        const guard2 = DefenseModel.createGuard(pc2)
        expect(guard2.value).toBe(8)
        expect(guard2.bonus).toBe(0)
      })
    })

    describe('.createDodge()', () => {
      it("works", () => {
        const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
        const dodge1 = DefenseModel.createDodge(pc1)
        expect(dodge1.value).toBe(0)
        expect(dodge1.bonus).toBe(0)
        
        const pc2 = PcModel.createCharacter({ name: "Kastun", level: 3 })
        pc2.dodgeScaling.bonus = -1
        pc2.attributes.Agility.value = 5
        pc2.attributes.Perception.value = 4
        pc2.attributes.Deception.value = 3
        const dodge2 = DefenseModel.createDodge(pc2)
        expect(dodge2.value).toBe(8)
        expect(dodge2.bonus).toBe(0)
      })
    })
  })
})
