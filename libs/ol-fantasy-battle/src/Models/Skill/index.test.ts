import ScrollModel, { Skill, SkillModel } from "./index"

import { useDbConnection } from "@discord-bot/mongo"
import { createSkillProps } from "./statics/create"

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
  describe("statics", () => {
    describe(".create()", () => {
      it(`works for Attribute Roll, Attribute Damage skills`, () => {
        const props: createSkillProps = {
          name: "Eathen Hammer",
          description: "a slow, hard to hit and hard hitting attack",
          actionType: "major",

          damageOrHeal: "damage",
          skillType: "attack",
          damageType: "bludgeoning",

          mpCost: 2,
          // hpCost: 0
          
          attribute: "Might",
          bonus: -1,
          advantage: -2,

          dmgAttribute: "Might",
          dmgAttributeBonus: +3,
          dmgAdvantage: 1,
          dmgExplosion: 2,
        }

        const skill = SkillModel.createSkill(props)
        
        expect(skill.name)             .toBe(props.name)
        expect(skill.description)      .toBe(props.description)
        expect(skill.actionType)       .toBe(props.actionType)
        expect(skill.hpCost)           .toBe(0)
        expect(skill.mpCost)           .toBe(props.mpCost)
        expect(skill.skillType)        .toBe(props.skillType)
        expect(skill.attribute)        .toBe(props.attribute)
        expect(skill.bonus)            .toBe(props.bonus)
        expect(skill.advantage)        .toBe(props.advantage)
        expect(skill.damageOrHeal)     .toBe(props.damageOrHeal)
        expect(skill.damageType)       .toBe(props.damageType)
        expect(skill.dmgAttribute)     .toBe(props.dmgAttribute)
        expect(skill.dmgAttributeBonus).toBe(props.dmgAttributeBonus)
        expect(skill.dmgAdvantage)     .toBe(props.dmgAdvantage)
        expect(skill.dmgExplosion)     .toBe(props.dmgExplosion)
      })
      it(`works for Attribute Roll, No Damage skills`, () => {
        const props: createSkillProps = {
          name: "Charm Person",
          description: "Try to influence the mind of the target. If the roll exceds the CR set by the DM, the target suffers from the XXXX Bane",
          actionType: "major",

          damageOrHeal: "none",
          skillType: "attribute",

          mpCost: 3,
          hpCost: 1,
          
          attribute: "Influence",
          bonus: +1,
          // advantage: 0,
          
          // dmgAttribute: "Might",
          // because dmgAttribute isn't set, all of those will be ignored
          damageType: "bludgeoning",
          dmgAttributeBonus: +3,
          dmgAdvantage: 1,
          dmgExplosion: 2,
        }

        const skill = SkillModel.createSkill(props)

        expect(skill.name)             .toBe(props.name)
        expect(skill.description)      .toBe(props.description)
        expect(skill.actionType)       .toBe(props.actionType)
        expect(skill.hpCost)           .toBe(props.hpCost)
        expect(skill.mpCost)           .toBe(props.mpCost)
        expect(skill.skillType)        .toBe(props.skillType)
        expect(skill.attribute)        .toBe(props.attribute)
        expect(skill.bonus)            .toBe(props.bonus)
        expect(skill.advantage)        .toBe(0)
        expect(skill.damageOrHeal)     .toBe(props.damageOrHeal)
        expect(skill.damageType)       .toBeFalsy()
        expect(skill.dmgAttribute)     .toBeFalsy()
        expect(skill.dmgAttributeBonus).toBeFalsy()
        expect(skill.dmgAdvantage)     .toBeFalsy()
        expect(skill.dmgExplosion)     .toBeFalsy()

      })
      it(`works for No Attribute Roll, Attribute Damage skills`, () => {
        const props: createSkillProps = {
          name: "Ice Trap",
          description: "You set a trap down. if the target that triggers it fails a DC 18 Agility roll, they take all of the damage (Logic+2). If they succeed, they take half",
          actionType: "major",

          damageOrHeal: "damage",
          // skilltype will be ignored and set to "misc", since attribute isnt set
          skillType: "attribute",

          mpCost: 3,
          // hpCost: 1,
          
          // because attribute isn't set, all of those will be ignored
          // attribute: "Influence",
          bonus: +1,
          advantage: 0,
          
          dmgAttribute: "Logic",
          damageType: "cold",
          dmgAttributeBonus: +2,
        }

        const skill = SkillModel.createSkill(props)
        
        expect(skill.name)             .toBe(props.name)
        expect(skill.description)      .toBe(props.description)
        expect(skill.actionType)       .toBe(props.actionType)
        expect(skill.hpCost)           .toBe(0)
        expect(skill.mpCost)           .toBe(props.mpCost)
        expect(skill.skillType)        .toBe("misc")
        expect(skill.attribute)        .toBeFalsy()
        expect(skill.bonus)            .toBeFalsy()
        expect(skill.advantage)        .toBeFalsy()

        expect(skill.damageOrHeal)     .toBe(props.damageOrHeal)
        expect(skill.damageType)       .toBe(props.damageType)
        expect(skill.dmgAttribute)     .toBe(props.dmgAttribute)
        expect(skill.dmgAttributeBonus).toBe(props.dmgAttributeBonus)
        expect(skill.dmgAdvantage)     .toBe(0)
        expect(skill.dmgExplosion)     .toBe(props.dmgExplosion)
      })
      it(`works for No Attribute Roll, No Damage skills`, () => {
        const props: createSkillProps = {
          name: "Pass Without a Trace",
          description: "For the next 1 hour, this character and their allies have advantage+3 to stealth rolls",
          actionType: "complete",

          // skilltype will be ignored and set to "misc", since attribute isnt set
          skillType: "attribute",
          // damageOrHeal will be set to "none", since there is no damage roll
          damageOrHeal: "heal",

          mpCost: 3,
          // hpCost: 1,
          
          // because attribute isn't set, all of those will be ignored
          // attribute: "Influence",
          bonus: +1,
          advantage: 0,
          
          // dmgAttribute: "Might",
          // because dmgAttribute isn't set, all of those will be ignored
          damageType: "cold",
          dmgAttributeBonus: +2,
        }

        const skill = SkillModel.createSkill(props)
        
        expect(skill.name)             .toBe(props.name)
        expect(skill.description)      .toBe(props.description)
        expect(skill.actionType)       .toBe(props.actionType)
        expect(skill.hpCost)           .toBe(0)
        expect(skill.mpCost)           .toBe(props.mpCost)
        expect(skill.skillType)        .toBe("misc")
        expect(skill.attribute)        .toBeFalsy()
        expect(skill.bonus)            .toBeFalsy()
        expect(skill.advantage)        .toBeFalsy()

        expect(skill.damageOrHeal)     .toBe("none")
        expect(skill.damageType)       .toBeFalsy()
        expect(skill.dmgAttribute)     .toBeFalsy()
        expect(skill.dmgAttributeBonus).toBeFalsy()
        expect(skill.dmgAdvantage)     .toBeFalsy()
        expect(skill.dmgExplosion)     .toBeFalsy()
      })
    })
  })
  describe("methods", () => {})
})
