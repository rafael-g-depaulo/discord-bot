import PcModel, { Pc } from "Models/PlayerCharacter"
import createFromModel from "./createFromModel"

describe('createFromModel', () => {

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

  it(`parses the character name`, () => {
    const pcProps: Pc = {
      name: "Vex",
      attributes: mockAttributes(),
    }
    const pcDoc = new PcModel(pcProps)
    const createdFromModel = createFromModel(pcDoc)

    expect(createdFromModel.name).toBe("Vex")
  })

  it(`parses the attributes`, () => {
    const pcProps: Pc = {
      name: "Vex",
      attributes: mockAttributes(),
    }
    pcProps.attributes.Agility.value = 6
    const pcDoc = new PcModel(pcProps)
    const character = createFromModel(pcDoc)

    expect(character.attributes).toMatchObject({
      Agility:    { bonus: 0, value: 6 }, Fortitude:  { bonus: 0, value: 0 },
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

  it(`has functioning attributes`, () => {
    const pcProps: Pc = {
      name: "Vex",
      attributes: mockAttributes(),
    }
    const pcDoc = new PcModel(pcProps)
    const char = createFromModel(pcDoc)

    const agility0SkillRoll = char.attributes.Agility.rollAttribute()
    const agility0DmgRoll = char.attributes.Agility.rollDmg()

    char.attributes.Agility.bonus = 4
    char.attributes.Agility.value = 1

    const agility3SkillRoll = char.attributes.Agility.rollAttribute()
    const agility3DmgRoll = char.attributes.Agility.rollDmg()

    expect(agility0SkillRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1, bonus: 0 }))
    expect(agility0DmgRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 2, dieAmmount: 1, bonus: 0 }))
    
    expect(agility3SkillRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1, bonus: 10 }))
    expect(agility3DmgRoll.diceArgs).toEqual(expect.objectContaining({ dieMax: 6, dieAmmount: 2, bonus: 0 }))
  })
})
