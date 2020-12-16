import createDie from "die"
import { RandFn } from "utils"
import roll from "./roll"
import { DiceArgs, DiceState } from "./index"

describe("roll", () => {
  const mockState: (props: Required<DiceArgs>, randomFn?: RandFn) => DiceState = (props, randomFn) => ({
    args: props,
    die: createDie({...props, randomFn })
  })

  it("works", () => {
    const randFn = jest.fn()
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.5)
      .mockReturnValue(1)

    const state = mockState({
      dieMax: 20,
      dieAmmount: 1,
      bonus: 0,
      explode: false,
      advantage: 0,
    }, randFn)

    expect(roll(state)).toBe(1)
    expect(roll(state)).toBe(10)
    expect(roll(state)).toBe(20)
  })

  it("works with bonus", () => {
    
    const stateProps = {
      dieMax: 10,
      dieAmmount: 1,
      explode: false,
      advantage: 0,
    }
    
    const dice1 = mockState({ ...stateProps, bonus: -4 }, jest.fn(() => 1))
    const dice2 = mockState({ ...stateProps, bonus: 0 }, jest.fn(() => 1))
    const dice3 = mockState({ ...stateProps, bonus: 3 }, jest.fn(() => 1))
    
    expect(roll(dice1)).toBe(6)
    expect(roll(dice2)).toBe(10)
    expect(roll(dice3)).toBe(13)
  })

  describe("with (dis)advantage", () => {
      
    it("works with advantage 1", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1/6)
        .mockReturnValueOnce(3/6)

      const stateProps = {
        dieMax: 6,
        dieAmmount: 1,
        bonus: 2,
        explode: false,
        advantage: 1,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(3 + 2)
    })

    it("works with advantage above 1", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1/10)
        .mockReturnValueOnce(4/10)
        .mockReturnValueOnce(6/10)

      const stateProps = {
        dieMax: 10,
        dieAmmount: 1,
        bonus: 2,
        explode: false,
        advantage: 2,
      }

      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(8)
    })

    it("works with disadvantage 1", () => {
      const minThenMax = jest.fn()
        minThenMax.mockReturnValueOnce(0)
        minThenMax.mockReturnValue(1)

      const stateProps = {
        dieMax: 8,
        dieAmmount: 1,
        bonus: 0,
        explode: false,
        advantage: -1,
      }
      const state = mockState(stateProps, minThenMax)
      expect(roll(state)).toBe(1)
    })

    it("works with disadvantage above 1", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(0.5)
        .mockReturnValueOnce(0.8)
        .mockReturnValueOnce(0.2)

      const stateProps = {
        dieMax: 10,
        dieAmmount: 1,
        bonus: 0,
        explode: false,
        advantage: -2,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(2)
    })

  })

  describe("with multiple die", () => {

    it("works", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1)   // 20
        .mockReturnValueOnce(0.5) // 10
        .mockReturnValueOnce(0)   // 1
      
      const stateProps = {
        dieMax: 20,
        dieAmmount: 3,
        bonus: 0,
        explode: false,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(20 + 10 + 1)
    })

    it("works with bonus", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1)   // 10
        .mockReturnValueOnce(0.5) // 5
        .mockReturnValueOnce(0)   // 1
      
      const stateProps = {
        dieMax: 10,
        dieAmmount: 2,
        bonus: -2,
        explode: false,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(10 + 5 - 2)
    })

    it("works with advantage", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1)   // 10
        .mockReturnValueOnce(0)   // 1
        .mockReturnValue(0.5)     // 5
      
      const stateProps = {
        dieMax: 10,
        dieAmmount: 2,
        bonus: -2,
        explode: false,
        advantage: 1,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(10 + 5 - 2)
    })
  })

  describe("with explosion", () => {
    it("works with explosion: true", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1)   // 6
        .mockReturnValue(0)       // 1
      
      const stateProps = {
        dieMax: 6,
        dieAmmount: 1,
        bonus: 0,
        explode: true,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(7)
    })

    it("works with explosion: false", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1)   // 6
        .mockReturnValue(0)       // 1
      
      const stateProps = {
        dieMax: 6,
        dieAmmount: 1,
        bonus: 0,
        explode: false,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(6)
    })

    it("works with explosion: 1 (explosive path)", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(1)   // 6
        .mockReturnValue(0)       // 1
      
      const stateProps = {
        dieMax: 6,
        dieAmmount: 1,
        bonus: 0,
        explode: 1,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(7)
    })

    it("works with explosion: 1 (non-explosive path)", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(5/6) // 5
        .mockReturnValue(0)       // 1
      
      const stateProps = {
        dieMax: 6,
        dieAmmount: 1,
        bonus: 0,
        explode: 1,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(5)
    })

    it("works with explosion over 1 (explosive path)", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(5/6) // 5
        .mockReturnValue(0)       // 1

      const stateProps = {
        dieMax: 6,
        explode: 2,
        dieAmmount: 1,
        bonus: 0,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(6)
    })

    it("works with explosion over 1 (non-explosive path)", () => { 
      const randomFn = jest.fn()
        .mockReturnValueOnce(4/6) // 4
        .mockReturnValue(0)       // 1

      const stateProps = {
        dieMax: 6,
        explode: 2,
        dieAmmount: 1,
        bonus: 0,
        advantage: 0,
      }
      const state = mockState(stateProps, randomFn)
      expect(roll(state)).toBe(4)
    })
  })
})
