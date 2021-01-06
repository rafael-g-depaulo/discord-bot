import mockAttributes from "Utils/mockAttributes"
import PcModel, { Pc } from ".."
import rollDmg from "./rollDmg"

describe('PlayerCharacter.rollDmg()', () => {
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
    expect(rollDmg.call(mockedPc, "Agility").diceArgs).toEqual(expect.objectContaining({ dieAmmount:  1, dieMax:  2 }))
  })
  it('works with bonus', () => {
    const mockedPc = mockPc()
    mockedPc.attributes.Creation.value = 1
    mockedPc.attributes.Creation.bonus = -4
    mockedPc.attributes.Fortitude.bonus = 4
    mockedPc.attributes.Fortitude.value = 4
    mockedPc.attributes.Logic.value = 25
    mockedPc.attributes.Logic.bonus = -4
    mockedPc.attributes.Might.value = 12
    mockedPc.attributes.Might.bonus = 2
    expect(rollDmg.call(mockedPc, "Creation",  { bonus:  0 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount:  1, dieMax:  2 }))
    expect(rollDmg.call(mockedPc, "Fortitude", { bonus: -1 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount:  2, dieMax: 10 }))
    expect(rollDmg.call(mockedPc, "Logic",     { bonus: +2 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 10, dieMax: 10 }))
    expect(rollDmg.call(mockedPc, "Might",     { bonus: +5 }).diceArgs).toEqual(expect.objectContaining({ dieAmmount: 11, dieMax:  8 }))
  })
})
