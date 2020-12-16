import { DiceArgs, DiceState } from "./index"
import createDie from "../die"
import { RandFn } from "../utils"
import detailedRoll from "./detailedRoll"

describe("detailedRoll", () => {
  
  const mockState: (props: Required<DiceArgs>, randomFn?: RandFn) => DiceState = (props, randomFn) => ({
    args: props,
    die: createDie({...props, randomFn })
  })

  it("works (simple path)", () => {
    const randomFn = jest.fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValue(0)

    const state = mockState({
      dieMax: 10,
      dieAmmount: 1,
      bonus: 0,
      explode: false,
      advantage: 0,
    }, randomFn)

    const rollResults = detailedRoll(state)

    expect(rollResults.rolls).toEqual([{ value: 5 }])
    expect(rollResults.total).toBe(5)
  })
  
  it("works with dieAmmount", () => {
    const randomFn = jest.fn()
      .mockReturnValueOnce(11/20) // 11
      .mockReturnValueOnce(14/20) // 14
      .mockReturnValue    ( 1/20) // 1

    const state = mockState({
      dieMax: 20,
      dieAmmount: 3,
      bonus: 0,
      explode: false,
      advantage: 0,
    }, randomFn)

    const rollResults = detailedRoll(state)

    expect(rollResults.total).toBe(26)
    expect(rollResults.rolls).toEqual([
      { value: 11 },
      { value: 14 },
      { value: 1 },
    ])
  })
  
  it("works with advantage", () => {
    const randomFn = jest.fn()
      .mockReturnValueOnce(7/20)  // 7
      .mockReturnValueOnce(14/20) // 14
      .mockReturnValue    (13/20) // 13
    
    const state = mockState({
      dieMax: 20,
      dieAmmount: 1,
      bonus: 0,
      explode: false,
      advantage: 2,
    }, randomFn)

    const rollResults = detailedRoll(state)

    expect(rollResults.total).toBe(14)
    expect(rollResults.rolls).toEqual([
      { value: 7, ignored: true },
      { value: 14 },
      { value: 13, ignored: true },
    ])
  })

  it("works with disadvantage", () => {
    const randomFn = jest.fn()
      .mockReturnValueOnce(7/20)  // 7
      .mockReturnValueOnce(14/20) // 14
      .mockReturnValue    (5/20)  // 5
    
    const state = mockState({
      dieMax: 20,
      dieAmmount: 1,
      bonus: 0,
      explode: false,
      advantage: -2,
    }, randomFn)

    const rollResults = detailedRoll(state)

    expect(rollResults.total).toBe(5)
    expect(rollResults.rolls).toEqual([
      { value: 7, ignored: true },
      { value: 14, ignored: true },
      { value: 5 },
    ])
  })
  
  it("works with dieAmmount + (dis)advantage", () => {
    const mock1 = jest.fn()
      .mockReturnValueOnce(7/20)
      .mockReturnValueOnce(14/20)
      .mockReturnValue(5/20)
    const mock2 = jest.fn()
      .mockReturnValueOnce(6/12)
      .mockReturnValueOnce(11/12)
      .mockReturnValueOnce(1/12)
      .mockReturnValue(8/12)

    const state1 = mockState({
      dieMax: 20,
      advantage: 1,
      dieAmmount: 2,
      bonus: 4,
      explode: false,
    }, mock1)

    const state2 = mockState({
      dieMax: 12,
      advantage: -2,
      dieAmmount: 2,
      bonus: -14,
      explode: false,
    }, mock2)

    const rollResults1 = detailedRoll(state1)
    const rollResults2 = detailedRoll(state2)

    expect(rollResults1.total).toBe(25)
    expect(rollResults1.diceArgs.bonus).toBe(4)
    expect(rollResults1.rolls).toEqual([
      { value: 7 },
      { value: 14 },
      { value: 5, ignored: true },
    ])

    expect(rollResults2.total).toBe(-7)
    expect(rollResults2.diceArgs.bonus).toBe(-14)
    expect(rollResults2.rolls).toEqual([
      { value: 6, },
      { value: 11, ignored: true },
      { value: 1, },
      { value: 8, ignored: true },
    ])
  })
  
  it("works with explosion", () => {
    const randomFn1 = jest.fn()
      .mockReturnValueOnce(6/6)
      .mockReturnValueOnce(5/6)
      .mockReturnValue(4/6)
    const randomFn2 = jest.fn()
      .mockReturnValueOnce(8/8)
      .mockReturnValueOnce(5/8)

    const state1 = mockState({
      dieMax: 6,
      explode: 2,
      dieAmmount: 1,
      bonus: 0,
      advantage: 0,
    }, randomFn1)
    const rollResults1 = detailedRoll(state1)

    const state2 = mockState({
      dieMax: 8,
      explode: true,
      dieAmmount: 1,
      bonus: 0,
      advantage: 0,
    }, randomFn2)
    const rollResults2 = detailedRoll(state2)
   
    expect(rollResults1.total).toBe(15)
    expect(rollResults1.diceArgs.bonus).toBe(0)
    expect(rollResults1.rolls).toEqual([
      { value: 6, exploded: true },
      { value: 5, exploded: true },
      { value: 4 },
    ]) 
    expect(rollResults2.total).toBe(13)
    expect(rollResults2.diceArgs.bonus).toBe(0)
    expect(rollResults2.rolls).toEqual([
      { value: 8, exploded: true },
      { value: 5 },
    ])
  })

  it("works with advantage + dieAmmount + explosion", () => {
    const randomFn = jest.fn()
      .mockReturnValueOnce(2/6) // 2 (1)
      .mockReturnValueOnce(6/6) // 6 (removed)
      .mockReturnValueOnce(3/6) // 3 (2)
      .mockReturnValueOnce(6/6) // 6 (removed)
      .mockReturnValueOnce(6/6) // 4 (3 exploded)
      .mockReturnValue    (3/6) // 3 (3)

    const state = mockState({
      dieMax: 6,
      explode: 3,
      dieAmmount: 3,
      bonus: -2,
      advantage: -2,
    }, randomFn)
    const rollResults = detailedRoll(state)

    expect(rollResults.total).toBe(12)
    expect(rollResults.diceArgs.bonus).toBe(-2)
    expect(rollResults.rolls).toEqual([
      { value: 2, },
      { value: 6, ignored: true },
      { value: 3, },
      { value: 6, ignored: true },
      { value: 6, exploded: true },
      { value: 3, },
    ])
  })

  it("returns a copy of the dice roll props", () => {
    const diceProps = {
      dieMax: 6,
      explode: 3,
      dieAmmount: 3,
      bonus: -2,
      advantage: -2,
    }
    const state = mockState(diceProps)
    const rollResults = detailedRoll(state)

    expect(rollResults.diceArgs).toMatchObject(diceProps)
  })
})
