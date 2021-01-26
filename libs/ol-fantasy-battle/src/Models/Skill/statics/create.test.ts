import { useDbConnection } from "@discord-bot/mongo"
import SkillModel from ".."

import create, { createSkillProps } from "./create"

describe('SkillModel.create()', () => {
  useDbConnection("SkillModel_create")
  
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

    const skill = create.call(SkillModel, props)
    
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

    const skill = create.call(SkillModel, props)

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

    const skill = create.call(SkillModel, props)
    
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

    const skill = create.call(SkillModel, props)
    
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
