import getSkillDice from "./getSkillDice"

describe('getSkillDice()', () => {
  it('works', () => {
    expect(getSkillDice(0) .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 0 }))
    expect(getSkillDice(-3).args).toEqual(expect.objectContaining({ dieMax: 20, bonus: -6 }))
    expect(getSkillDice(7) .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 14 }))
    expect(getSkillDice(4) .args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 8 }))
    expect(getSkillDice(10).args).toEqual(expect.objectContaining({ dieMax: 20, bonus: 20 }))
  })
})
