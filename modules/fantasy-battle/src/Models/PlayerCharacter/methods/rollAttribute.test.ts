import mockAttributes from "Utils/mockAttributes"
import PcModel, { Pc } from ".."
import rollAttribute from "./rollAttribute"

describe('PlayerCharacter.rollAttribute()', () => {
  const mockPc = () => {
    const props: Pc = {
      name: "testName",
      attributes: mockAttributes()
    }
    return new PcModel(props)
  }
  it('works', () => {
    const mockedPc = mockPc()
    mockedPc.attributes.Agility.value = 0
    mockedPc.attributes.Agility.bonus = 0

    mockedPc.attributes.Creation.value = 1
    mockedPc.attributes.Creation.bonus = -4
    
    mockedPc.attributes.Fortitude.bonus = 4
    mockedPc.attributes.Fortitude.value = 4
    
    mockedPc.attributes.Logic.value = 6
    mockedPc.attributes.Logic.bonus = -4
    
    mockedPc.attributes.Might.value = -2
    mockedPc.attributes.Might.bonus = 7
    
    expect(rollAttribute.call(mockedPc, "Agility")      .diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 0 }))
    expect(rollAttribute.call(mockedPc, "Creation", 0)  .diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: -6 }))
    expect(rollAttribute.call(mockedPc, "Fortitude", -1).diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 14 }))
    expect(rollAttribute.call(mockedPc, "Logic", +2)    .diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 8 }))
    expect(rollAttribute.call(mockedPc, "Might", +5)    .diceArgs).toEqual(expect.objectContaining({ dieMax: 20, bonus: 20 }))
  })
})
