import createDice from "./dice"

describe('dice', () => {

  const varyingLuck = jest.fn()

  beforeEach(() => {
    varyingLuck.mockReset()
    varyingLuck.mockReturnValueOnce(0)
    varyingLuck.mockReturnValueOnce(0.5)
    varyingLuck.mockReturnValueOnce(0.8)
    varyingLuck.mockReturnValue(1)
  })

  describe("roll", () => {

    it("works", () => {
      const options = {
        dieMax: 20,
      }
      const initiativeRoll = createDice(options)
      Array(100).fill(null)
        .forEach(() => {
          expect(initiativeRoll.roll()).toBeGreaterThanOrEqual(1)
          expect(initiativeRoll.roll()).toBeLessThanOrEqual(options.dieMax)
        })
    })

    it("works with bonus", () => {
      const options = {
        dieMax: 10,
        bonus: 4,
        randomFn: jest.fn(() => 1)
      }
      const dice1 = createDice(options)
      const dice2 = createDice({...options, bonus: 0})
      const dice3 = createDice({...options, bonus: -15})
      
      expect(dice1.roll()).toBe(options.dieMax + options.bonus)
      expect(dice2.roll()).toBe(options.dieMax)
      expect(dice3.roll()).toBe(options.dieMax - 15)
    })

    describe("with (dis)advantage", () => {
        
      it("works with advantage 1", () => {
        const options = {
          dieMax: 6,
          bonus: 2,
          advantage: 1,
          randomFn: varyingLuck,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(options.bonus + 4)
      })

      it("works with advantage above 1", () => {
        const options = {
          dieMax: 10,
          advantage: 2,
          randomFn: varyingLuck,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(9)
      })

      it("works with disadvantage 1", () => {
        const minThenMax = jest.fn()
        minThenMax.mockReturnValueOnce(0)
        minThenMax.mockReturnValue(1)

        const options = {
          dieMax: 8,
          bonus: 0,
          advantage: -1,
          randomFn: minThenMax,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(options.bonus + 1)
      })

      it("works with disadvantage above 1", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(0.5)
          .mockReturnValueOnce(0.8)
          .mockReturnValueOnce(0.2)

        const options = {
          dieMax: 10,
          advantage: -2,
          randomFn,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(3)
      })

    })

    describe("with multiple die", () => {

      it("works", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 20
          .mockReturnValueOnce(0.5) // 11
          .mockReturnValueOnce(0)   // 1
        
        const options = {
          dieMax: 20,
          dieAmmount: 3,
          randomFn,
        }
        const dice = createDice(options)
        expect(dice.roll()).toBe(20 + 11 + 1)
      })

      it("works with bonus", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 10
          .mockReturnValueOnce(0.5) // 6
          .mockReturnValueOnce(0)   // 1
        
        const options = {
          dieMax: 10,
          dieAmmount: 2,
          bonus: -2,
          randomFn,
        }
        const dice = createDice(options)
        expect(dice.roll()).toBe(10 + 6 - 2)
      })

      it("works with advantage", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 10
          .mockReturnValueOnce(0)   // 1
          .mockReturnValue(0.5)     // 6
        
        const options = {
          dieMax: 10,
          dieAmmount: 2,
          advantage: 1,
          randomFn,
        }
        const dice = createDice(options)
        expect(dice.roll()).toBe(10 + 6)
      })
    })
  })
})
