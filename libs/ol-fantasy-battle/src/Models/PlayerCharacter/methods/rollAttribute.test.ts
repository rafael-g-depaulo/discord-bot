import mockAttributes from "Utils/mockAttributes"
import PcModel, { Pc } from ".."
import rollAttribute from "./rollAttribute"

describe('PlayerCharacter.rollAttribute()', () => {
  const mockPc = () => {
    const props: Pc = {
      name: "testName",
      attributes: mockAttributes(),
      skills: [],
    }
    return new PcModel(props)
  }
  it('works', () => {
    const mockedPc = mockPc()
    mockedPc.attributes.Agility.value = 0
    mockedPc.attributes.Agility.bonus = 0    
    expect(rollAttribute.call(mockedPc, "Agility")      .diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 0 }))
  })

  it('works with bonus', () => {
    const mockedPc = mockPc()
    mockedPc.attributes.Creation.value = 1
    mockedPc.attributes.Creation.bonus = -4
    mockedPc.attributes.Fortitude.bonus = 4
    mockedPc.attributes.Fortitude.value = 4
    mockedPc.attributes.Logic.value = 6
    mockedPc.attributes.Logic.bonus = -4
    mockedPc.attributes.Might.value = -2
    mockedPc.attributes.Might.bonus = 7
    expect(rollAttribute.call(mockedPc, "Creation",   { bonus:  0 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: -6 }))
    expect(rollAttribute.call(mockedPc, "Fortitude",  { bonus: -1 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 15 }))
    expect(rollAttribute.call(mockedPc, "Logic",      { bonus: +2 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus:  6 }))
    expect(rollAttribute.call(mockedPc, "Might",      { bonus: +5 }).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 15 }))
  })
})
