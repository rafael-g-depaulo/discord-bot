import SkillModel from "Models/Skill"
import PcModel, { Pc } from ".."

import rollSkill from "./rollSkill"

describe('PlayerCharacter.rollSkill()', () => {
  const mockPc = () => {
    const pc = PcModel.createCharacter({ name: "testName" })
    pc.attributes.Might.value = 2
    pc.attributes.Might.bonus = 2
    pc.attributes.Energy.value = 6
    pc.attributes.Energy.bonus = -2
    pc.skills = [
      SkillModel.createSkill({
        name: "Stone Hammer",
        description: "aa",
        attribute: "Might",
        dmgAttribute: "Might",
        bonus: -2,
        mpCost: 2,
        dmgAttributeBonus: 2,
        dmgExplosion: 3,
      }),
      SkillModel.createSkill({
        name: "Fire Ball",
        description: "aa",
        skillType: "attribute",
        attribute: "Energy",
        dmgAttribute: "Energy",
        mpCost: 3,
        dmgAttributeBonus: 1,
      }),
      SkillModel.createSkill({
        name: "Charm Person",
        description: "aa",
        attribute: "Influence",
        mpCost: 3,
        hpCost: 1,
      }),
      SkillModel.createSkill({
        name: "Ice Trap",
        description: "aa",
        dmgAttribute: "Logic",
        dmgAttributeBonus: 2,
        damageType: "cold",
        mpCost: 2,
      }),
      SkillModel.createSkill({
        name: "Pass Without a Trace",
        description: "aa",
        actionType: "complete",
        mpCost: 3,
      })
    ]
    return pc
  }

  it('rejects if index is out of bounds', async () => {
    const mockedPc = mockPc()
    const skillRoll1 = rollSkill.call(mockedPc, -1)
    const skillRoll2 = rollSkill.call(mockedPc, 5)

    expect(skillRoll1).toBe(null)
    expect(skillRoll2).toBe(null)
  })

  it('works for Attack Skills', async () => {
    const mockedPc = mockPc()
    const skillIndex = 0
    const skillRoll = rollSkill.call(mockedPc, skillIndex)

    const { bonus, advantage } = mockedPc.skills[skillIndex]
    const mightAttack = mockedPc.rollAtk("Might", { bonus, advantage })

    const { dmgAttributeBonus, dmgAdvantage, dmgExplosion } = mockedPc.skills[skillIndex]
    const dmgProps = { advantage: dmgAdvantage, explode: dmgExplosion }
    mockedPc.attributes.Might.bonus += dmgAttributeBonus ?? 0
    const mightDmg = mockedPc.rollDmg("Might", dmgProps)
    mockedPc.attributes.Might.bonus -= dmgAttributeBonus ?? 0

    expect(skillRoll).not.toBe(null)
    expect(skillRoll?.skill).toMatchObject(mockedPc.skills[skillIndex])
    expect(skillRoll?.roll?.diceArgs).toMatchObject(mightAttack.diceArgs)
    expect(skillRoll?.dmg?.diceArgs).toMatchObject(mightDmg.diceArgs)
  })

  it('works for non-Attack damaging Attribute skills', async () => {
    const mockedPc = mockPc()
    const skillIndex = 1
    const skillRoll = rollSkill.call(mockedPc, skillIndex)
    const { bonus, advantage } = mockedPc.skills[skillIndex]
    const energyRoll = mockedPc.rollAttribute("Energy", { bonus, advantage })

    const { dmgAttributeBonus, dmgAdvantage, dmgExplosion } = mockedPc.skills[skillIndex]
    const dmgProps = { advantage: dmgAdvantage, explode: dmgExplosion }
    mockedPc.attributes.Energy.bonus += dmgAttributeBonus ?? 0
    const energyDmg = mockedPc.rollDmg("Energy", dmgProps)
    mockedPc.attributes.Energy.bonus -= dmgAttributeBonus ?? 0

    expect(skillRoll).not.toBe(null)
    expect(skillRoll?.skill).toMatchObject(mockedPc.skills[skillIndex])
    expect(skillRoll?.roll?.diceArgs).toMatchObject(energyRoll.diceArgs)
    expect(skillRoll?.dmg?.diceArgs).toMatchObject(energyDmg.diceArgs)
  })

  it('works for non-Damaging Attribute-rolling skills', () => {
    const mockedPc = mockPc()
    const skillIndex = 2
    const skillRoll = rollSkill.call(mockedPc, skillIndex)
    
    const { bonus, advantage } = mockedPc.skills[skillIndex]
    const attbRoll = mockedPc.rollAttribute("Influence", { bonus, advantage })

    // const { dmgAttributeBonus, dmgAdvantage, dmgExplosion } = mockedPc.skills[skillIndex]
    // const dmgProps = { advantage: dmgAdvantage, explode: dmgExplosion }
    // mockedPc.attributes.Might.bonus += dmgAttributeBonus ?? 0
    // const dmgRoll = mockedPc.rollDmg("Might", dmgProps)
    // mockedPc.attributes.Might.bonus -= dmgAttributeBonus ?? 0

    expect(skillRoll).not.toBe(null)
    expect(skillRoll?.skill).toMatchObject(mockedPc.skills[skillIndex])
    expect(skillRoll?.roll?.diceArgs).toMatchObject(attbRoll.diceArgs)
    expect(skillRoll?.dmg).toBe(null)
    // expect(skillRoll?.dmg?.diceArgs).toMatchObject(dmgRoll.diceArgs)
  })

  it('works for Damaging non-Attribute-rolling skills', () => {
    const mockedPc = mockPc()
    const skillIndex = 3
    const skillRoll = rollSkill.call(mockedPc, skillIndex)
    
    // const { bonus, advantage } = mockedPc.skills[skillIndex]
    // const attbRoll = mockedPc.rollAttribute("Influence", { bonus, advantage })

    const { dmgAttributeBonus, dmgAdvantage, dmgExplosion } = mockedPc.skills[skillIndex]
    const dmgProps = { advantage: dmgAdvantage, explode: dmgExplosion }
    mockedPc.attributes.Logic.bonus += dmgAttributeBonus ?? 0
    const dmgRoll = mockedPc.rollDmg("Logic", dmgProps)
    mockedPc.attributes.Logic.bonus -= dmgAttributeBonus ?? 0

    expect(skillRoll).not.toBe(null)
    expect(skillRoll?.skill).toMatchObject(mockedPc.skills[skillIndex])
    // expect(skillRoll?.roll?.diceArgs).toMatchObject(attbRoll.diceArgs)
    expect(skillRoll?.roll).toBe(null)
    expect(skillRoll?.dmg?.diceArgs).toMatchObject(dmgRoll.diceArgs)
  })

  it('works for non-Damaging non-Attribute-rolling skills', () => {
    const mockedPc = mockPc()
    const skillIndex = 4
    const skillRoll = rollSkill.call(mockedPc, skillIndex)
    
    expect(skillRoll).not.toBe(null)
    expect(skillRoll?.skill).toMatchObject(mockedPc.skills[skillIndex])
    expect(skillRoll?.roll).toBe(null)
    expect(skillRoll?.dmg).toBe(null)
  })
})
