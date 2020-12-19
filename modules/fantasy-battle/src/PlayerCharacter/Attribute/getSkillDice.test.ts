import { Attribute } from "."
import getSkillDice from "./getSkillDice"

describe('getSkillDice()', () => {
  const mockAttb = (v: number, b: number): Attribute => ({
    value: v,
    bonus: b,
  }) as Attribute

  it('works', () => {
    expect(getSkillDice(mockAttb(6, -6)) .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 0 }))
    expect(getSkillDice(mockAttb(-5, 2)) .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: -6 }))
    expect(getSkillDice(mockAttb(0, 7))  .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 14 }))
    expect(getSkillDice(mockAttb(4, 0))  .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 8 }))
    expect(getSkillDice(mockAttb(15, -5)).args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 20 }))
  })
})
