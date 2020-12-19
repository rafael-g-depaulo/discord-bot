import { Attributes, createAttribute, createAttributes } from "./index"

describe("createAttributes", () => {
  it('works', () => {
    const inicialAttributes = {
      Agility:    { bonus: 0, value: 0 },
      Fortitude:  { bonus: 0, value: 0 },
      Might:      { bonus: 0, value: 0 },
      Learning:   { bonus: 0, value: 0 },
      Logic:      { bonus: 0, value: 0 },
      Perception: { bonus: 0, value: 0 },
      Will:       { bonus: 0, value: 0 },
      Deception:  { bonus: 0, value: 0 },
      Persuasion: { bonus: 0, value: 0 },
      Presence:   { bonus: 0, value: 0 },
      Alteration: { bonus: 0, value: 0 },
      Creation:   { bonus: 0, value: 0 },
      Energy:     { bonus: 0, value: 0 },
      Entropy:    { bonus: 0, value: 0 },
      Influence:  { bonus: 0, value: 0 },
      Movement:   { bonus: 0, value: 0 },
      Prescience: { bonus: 0, value: 0 },
      Protection: { bonus: 0, value: 0 },
    }
    expect(createAttributes()).toMatchObject(inicialAttributes)
  })

  describe(".rollAttribute()", () => {
    it(`works with the original value`, () => {
      const attb = createAttribute()
      const rollResult = attb.rollAttribute()
      expect(rollResult.diceArgs).toEqual(expect.objectContaining({ dieMax: 20, dieAmmount: 1 }))
    })

    it(`works when you change the original value`, () => {
      const attb = createAttribute()
      expect(attb.rollAttribute().diceArgs).toEqual(expect
        .objectContaining({
          bonus: 0,
          dieMax: 20,
          dieAmmount: 1,
        })
      )
      attb.value = 2
      attb.bonus = 1
      expect(attb.rollAttribute().diceArgs).toEqual(expect
        .objectContaining({
          bonus: 6,
          dieMax: 20,
          dieAmmount: 1,
        })
      )
      attb.value = 2
      attb.bonus = 3
      expect(attb.rollAttribute().diceArgs).toEqual(expect
        .objectContaining({
          bonus: 10,
          dieMax: 20,
          dieAmmount: 1,
        })
      )
    })
  })

  describe(".rollDmg()", () => {
    
    it(`works with the original value`, () => {
      const attb = createAttribute()
      const rollResult = attb.rollDmg()
      expect(rollResult.diceArgs).toEqual(expect.objectContaining({ dieMax: 2, dieAmmount: 1 }))
    })

    it(`works when you change the original value`, () => {
      const attb = createAttribute()
      expect(attb.rollDmg().diceArgs).toEqual(expect
        .objectContaining({
          dieMax: 2,
          dieAmmount: 1,
        })
      )
      attb.value = 2
      attb.bonus = 1
      expect(attb.rollDmg().diceArgs).toEqual(expect
        .objectContaining({
          dieMax: 8,
          dieAmmount: 1,
        })
      )
      attb.value = 2
      attb.bonus = 3
      expect(attb.rollDmg().diceArgs).toEqual(expect
        .objectContaining({
          dieMax: 6,
          dieAmmount: 2,
        })
      )
    })
  })
})
