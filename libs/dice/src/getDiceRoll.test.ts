import { DiceProps } from "./Dice"
import getDiceRoll, { testDiceRoll } from "./getDiceRoll"

describe('testDiceRoll', () => {

  it(`works in simple case (ex: "d20")`, () => {
    const rolls = [
      " d20",
      "D12  ",
      " D 10  ",
    ]
    for (const roll of rolls) {
      expect(testDiceRoll(roll)).toBe(true)
    }
    
  })

  it(`works with die ammount (ex: 2d6)`, () => {
    const rolls = [
      "2 d6",
      "  8D22 ",
      "2 D 10 ",
    ]
    for (const roll of rolls) {
      expect(testDiceRoll(roll)).toBe(true)
    }
  })

  it(`works with die explosion (ex: 6d8!)`, () => {
    const rolls = [
      "2 d6 !   ",
      "  8D22 !!",
      "2 D 10! ",
    ]
    for (const roll of rolls) {
      expect(testDiceRoll(roll)).toBe(true)
    }
  })
  
  it(`works with bonus ammount (ex: 1d8+5)`, () => {
    const rolls = [
      "2 d6  - 22",
      " 24 d 46 +  05",
      "2 D 10-009",
    ]
    for (const roll of rolls) {
      expect(testDiceRoll(roll)).toBe(true)
    }
  })
  
  it(`works with advantage (ex: d20+5 adv+2)`, () => {
    const rolls = [
      "6d6 adv",
      "d20 dis",
      "2d10 adv+2",
      "2d10 adv  +  2",
      "2d10-5 adv- 5",
      "2d12 +4dis-4",
      "2d10 +4dis+ 4",
      "2 d  16 +4  dis - 4",
    ]

    for (const roll of rolls) {
      expect(testDiceRoll(roll)).toBe(true)
    }
  })

})

describe('getDiceRoll', () => {

  type ExpectedResult = [string, DiceProps]

  it(`works in simple case (ex: "d20")`, () => {
    const rolls: ExpectedResult[] = [
      [" d20",    { dieMax: 20 }],
      ["D12  ",   { dieMax: 12 }],
      [" D 10  ", { dieMax: 10 }],
    ]

    for (const roll of rolls) {
      expect(getDiceRoll(roll[0])).toMatchObject(roll[1])
    }
  })

  
  it(`works with die ammount (ex: "2d6")`, () => {
    const rolls: ExpectedResult[] = [
      [" 5d20",     { dieAmmount: 5, dieMax: 20 }],
      ["14 D6  ",   { dieAmmount: 14, dieMax: 6 }],
      [" 76 D 10 ", { dieAmmount: 76, dieMax: 10 }],
    ]

    for (const roll of rolls) {
      expect(getDiceRoll(roll[0])).toMatchObject(roll[1])
    }
  })
  
  it(`works with die explosion (ex: 6d8!)`, () => {
    const rolls: ExpectedResult[] = [
      ["2 d6 !   ", { dieAmmount: 2, dieMax: 6,  explode: 1}],
      ["  8D22 !!", { dieAmmount: 8, dieMax: 22, explode: 2}],
      ["2 D 10! ",  { dieAmmount: 2, dieMax: 10, explode: 1}],
    ]
    for (const roll of rolls) {
      expect(getDiceRoll(roll[0])).toMatchObject(roll[1])
    }
  })

  it(`doesn't allow explosion high enough for an infinite loop (nat 1 should never explode)`, () => {
    expect(getDiceRoll("1d4!!!!!!!!!!!!!!")).toMatchObject({ dieAmmount: 1, dieMax: 4, explode: 3 })
  })
  
  it(`works with bonus ammount (ex: 1d8!+5)`, () => {
    const rolls: ExpectedResult[] = [
      [" 6 d6-2",   { dieMax: 6,  bonus: -2, dieAmmount: 6 }],
      ["D 22 !+6",   { dieMax: 22, bonus: +6, }],
      ["2d6!!+  05", { dieMax: 6,  bonus: +5, dieAmmount: 2}],
      ["2D 10! -009", { dieMax: 10, bonus: -9, dieAmmount: 2}],
      ["2 D 10 -0", { dieMax: 10, bonus: -0, dieAmmount: 2 }],
      ["1d8+2", { dieMax: 8, bonus: +2, dieAmmount: 1 }],
    ]

    for (const roll of rolls) {
      expect(getDiceRoll(roll[0])).toMatchObject(roll[1])
    }
  })
  
  it(`works with advantage (ex: 5d20!!+5 adv+2)`, () => {
    const rolls: ExpectedResult[] = [
      ["6d6 adv",         { dieMax: 6,  advantage: 1,  dieAmmount: 6 }],
      ["d20 ! dis",       { dieMax: 20, advantage: -1, explode: 1, }],
      ["6d6+12adv",       { dieMax: 6,  advantage: 1,  dieAmmount: 6, bonus: +12 }],
      ["2d10 !!adv+2",    { dieMax: 10, advantage: 2,  explode: 2, dieAmmount: 2 }],
      ["2d10!!!-5 adv-5", { dieMax: 10, advantage: -5, explode: 3, dieAmmount: 2, bonus: -5 }],
      ["67d12!!!-3dis-8", { dieMax: 12, advantage: -8, explode: 3, dieAmmount: 67, bonus: -3 }],
      ["2d12 !!+4dis-4",  { dieMax: 12, advantage: -4, explode: 2, dieAmmount: 2, bonus: +4 }],
      ["2d10! +4dis+4",   { dieMax: 10, advantage: -4, explode: 1, dieAmmount: 2, bonus: +4 }],
    ]

    for (const roll of rolls) {
      expect(getDiceRoll(roll[0])).toMatchObject(roll[1])
    }
  })

})
