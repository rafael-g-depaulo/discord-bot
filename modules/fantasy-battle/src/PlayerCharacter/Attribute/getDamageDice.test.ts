import { Dice } from "@discord-bot/dice"
import getDamageDice from "./getDamageDice"

describe('getDamageDice', () => {
  it('works for attributes at or below 0', () => {
    const minDice = {
      dieMax: 2,
      dieAmmount: 1,
    }
    const dmgDice: Dice[] = [
      0, -1, -2, -3, -4
    ].map(getDamageDice)

    dmgDice.map(dice => {
      expect(dice.args.dieMax).toBe(minDice.dieMax)
      expect(dice.args.dieAmmount).toBe(minDice.dieAmmount)
    })
  })

  it('works for usual attributes (1 to max)', () => {
    // damage dice (example: damage dice for 1 is damageDice[1])
    const damageDice = Array(21)
      .fill(null)
      .map((_, i) => i)
      .map(getDamageDice)

    expect(damageDice[ 1].args).toStrictEqual(expect.objectContaining({ dieAmmount:  1, dieMax:  4 }))
    expect(damageDice[ 2].args).toStrictEqual(expect.objectContaining({ dieAmmount:  1, dieMax:  6 }))
    expect(damageDice[ 3].args).toStrictEqual(expect.objectContaining({ dieAmmount:  1, dieMax:  8 }))
    expect(damageDice[ 4].args).toStrictEqual(expect.objectContaining({ dieAmmount:  1, dieMax: 10 }))
    expect(damageDice[ 5].args).toStrictEqual(expect.objectContaining({ dieAmmount:  2, dieMax:  6 }))

    expect(damageDice[ 6].args).toStrictEqual(expect.objectContaining({ dieAmmount:  2, dieMax:  8 }))
    expect(damageDice[ 7].args).toStrictEqual(expect.objectContaining({ dieAmmount:  2, dieMax: 10 }))
    expect(damageDice[ 8].args).toStrictEqual(expect.objectContaining({ dieAmmount:  3, dieMax:  8 }))
    expect(damageDice[ 9].args).toStrictEqual(expect.objectContaining({ dieAmmount:  3, dieMax: 10 }))
    expect(damageDice[10].args).toStrictEqual(expect.objectContaining({ dieAmmount:  4, dieMax: 10 }))
    
    expect(damageDice[11].args).toStrictEqual(expect.objectContaining({ dieAmmount:  8, dieMax:  4 }))
    expect(damageDice[12].args).toStrictEqual(expect.objectContaining({ dieAmmount:  5, dieMax:  8 }))
    expect(damageDice[13].args).toStrictEqual(expect.objectContaining({ dieAmmount: 10, dieMax:  4 }))
    expect(damageDice[14].args).toStrictEqual(expect.objectContaining({ dieAmmount:  8, dieMax:  6 }))
    expect(damageDice[15].args).toStrictEqual(expect.objectContaining({ dieAmmount:  3, dieMax: 20 }))
    
    expect(damageDice[16].args).toStrictEqual(expect.objectContaining({ dieAmmount: 10, dieMax:  6 }))
    expect(damageDice[17].args).toStrictEqual(expect.objectContaining({ dieAmmount:  6, dieMax: 12 }))
    expect(damageDice[18].args).toStrictEqual(expect.objectContaining({ dieAmmount:  8, dieMax: 10 }))
    expect(damageDice[19].args).toStrictEqual(expect.objectContaining({ dieAmmount: 11, dieMax:  8 }))
    expect(damageDice[20].args).toStrictEqual(expect.objectContaining({ dieAmmount: 10, dieMax: 10 }))
  })

  it('defaults to max if the attribute is above the range', () => {
    const maxDice = {
      dieMax:     10,
      dieAmmount: 10,
    }
    const dmgDice: Dice[] = [
      20, 21, 22, 23, 144.5
    ].map(getDamageDice)
    dmgDice.map(dice => {
      expect(dice.args.dieMax).toBe(maxDice.dieMax)
      expect(dice.args.dieAmmount).toBe(maxDice.dieAmmount)
    })
  })
})
