import ScrollModel, { Skill, SkillModel } from "./index"

import { useDbConnection } from "@discord-bot/mongo"

describe("SkillModel", () => {
 
  useDbConnection("SkillModel")

  const attackSkill: Skill = {
    name: "Earth Hammer",
    description: "Hit's harder than usual, but it's easier to miss",
    actionType: "major",
    skillType: "attack",
    damageOrHeal: "damage",
    damageType: "bludgeoning",
    hpCost: 0,
    mpCost: 3,
    attribute: "Might",
    advantage: -2,
    bonus: -1,
    dmgAttribute: "Might",
    dmgAttributeBonus: 3,
    dmgExplosion: 2,
  }

  const miscSkill: Skill = {
    name: "Pass Without a Trace",
    description: "For the next 1 hour, this character and their allies have advantage+3 to stealth rolls",
    actionType: "complete",
    skillType: "misc",
    damageOrHeal: "none",
    hpCost: 0,
    mpCost: 2,
  }

  describe("CRUD", () => {
    it("creates", async () => {
      const attackSkillDoc = new SkillModel(attackSkill)
      expect(attackSkillDoc.name)             .toBe(attackSkill.name)
      expect(attackSkillDoc.description)      .toBe(attackSkill.description)
      expect(attackSkillDoc.skillType)        .toBe(attackSkill.skillType)
      expect(attackSkillDoc.damageOrHeal)     .toBe(attackSkill.damageOrHeal)
      expect(attackSkillDoc.damageType)       .toBe(attackSkill.damageType)
      expect(attackSkillDoc.hpCost)           .toBe(attackSkill.hpCost)
      expect(attackSkillDoc.mpCost)           .toBe(attackSkill.mpCost)
      expect(attackSkillDoc.attribute)        .toBe(attackSkill.attribute)
      expect(attackSkillDoc.advantage)        .toBe(attackSkill.advantage)
      expect(attackSkillDoc.bonus)            .toBe(attackSkill.bonus)
      expect(attackSkillDoc.dmgAttribute)     .toBe(attackSkill.dmgAttribute)
      expect(attackSkillDoc.dmgAttributeBonus).toBe(attackSkill.dmgAttributeBonus)
      expect(attackSkillDoc.dmgExplosion)     .toBe(attackSkill.dmgExplosion)

      const miscSkillDoc = new SkillModel(miscSkill)
      expect(miscSkillDoc.name)        .toBe(miscSkill.name)
      expect(miscSkillDoc.description) .toBe(miscSkill.description)
      expect(miscSkillDoc.actionType)  .toBe(miscSkill.actionType)
      expect(miscSkillDoc.skillType)   .toBe(miscSkill.skillType)
      expect(miscSkillDoc.damageOrHeal).toBe(miscSkill.damageOrHeal)
      expect(miscSkillDoc.hpCost)      .toBe(miscSkill.hpCost)
      expect(miscSkillDoc.mpCost)      .toBe(miscSkill.mpCost)
    })
    it("reads", async () => {
      const attackSkillDoc = new SkillModel(attackSkill)
      await attackSkillDoc.save()
      const fetchedSkill = await SkillModel.findById(attackSkillDoc._id)
      expect(fetchedSkill?.name)        .toBe(attackSkillDoc.name)
      expect(fetchedSkill?.description) .toBe(attackSkillDoc.description)
      expect(fetchedSkill?.actionType)  .toBe(attackSkillDoc.actionType)
      expect(fetchedSkill?.skillType)   .toBe(attackSkillDoc.skillType)
      expect(fetchedSkill?.damageOrHeal).toBe(attackSkillDoc.damageOrHeal)
      expect(fetchedSkill?.hpCost)      .toBe(attackSkillDoc.hpCost)
      expect(fetchedSkill?.mpCost)      .toBe(attackSkillDoc.mpCost)
    })
    it("updates", async () => {
      const attackSkillDoc = new SkillModel(attackSkill)
      await attackSkillDoc.save()
      const fetchedSkill1 = await SkillModel.findById(attackSkillDoc._id)
      expect(fetchedSkill1?.name)        .toBe(attackSkillDoc.name)
      expect(fetchedSkill1?.description) .toBe(attackSkillDoc.description)
      expect(fetchedSkill1?.actionType)  .toBe(attackSkillDoc.actionType)
      expect(fetchedSkill1?.skillType)   .toBe(attackSkillDoc.skillType)
      expect(fetchedSkill1?.damageOrHeal).toBe(attackSkillDoc.damageOrHeal)
      expect(fetchedSkill1?.hpCost)      .toBe(attackSkillDoc.hpCost)
      expect(fetchedSkill1?.mpCost)      .toBe(attackSkillDoc.mpCost)
      
      attackSkillDoc.mpCost = 5
      attackSkillDoc.hpCost = 2
      attackSkillDoc.bonus = -2
      await attackSkillDoc.save()

      const fetchedSkill2 = await SkillModel.findById(attackSkillDoc._id)
      expect(fetchedSkill2?.name)        .toBe(attackSkillDoc.name)
      expect(fetchedSkill2?.description) .toBe(attackSkillDoc.description)
      expect(fetchedSkill2?.actionType)  .toBe(attackSkillDoc.actionType)
      expect(fetchedSkill2?.skillType)   .toBe(attackSkillDoc.skillType)
      expect(fetchedSkill2?.damageOrHeal).toBe(attackSkillDoc.damageOrHeal)
      expect(fetchedSkill2?.mpCost)      .toBe(5)
      expect(fetchedSkill2?.hpCost)      .toBe(2)
      expect(fetchedSkill2?.bonus)       .toBe(-2)
    })
    it("deletes", async () => {
      const attackSkillDoc = new SkillModel(attackSkill)
      await attackSkillDoc.save()
      const fetchedSkill1 = await SkillModel.findById(attackSkillDoc._id)
      expect(fetchedSkill1?.name)        .toBe(attackSkillDoc.name)
      expect(fetchedSkill1?.description) .toBe(attackSkillDoc.description)
      expect(fetchedSkill1?.actionType)  .toBe(attackSkillDoc.actionType)
      expect(fetchedSkill1?.skillType)   .toBe(attackSkillDoc.skillType)
      expect(fetchedSkill1?.damageOrHeal).toBe(attackSkillDoc.damageOrHeal)
      expect(fetchedSkill1?.hpCost)      .toBe(attackSkillDoc.hpCost)
      expect(fetchedSkill1?.mpCost)      .toBe(attackSkillDoc.mpCost)
      
      await attackSkillDoc.delete()
      const fetchedSkill2 = await SkillModel.findById(attackSkillDoc._id)
      expect(fetchedSkill2).toBe(null)
    })
  })

  describe("virtuals", () => {})
  describe("statics", () => {})
  describe("methods", () => {})
})
