import createDice, { DiceProps } from "."

describe('dice', () => {

  describe("args", () => {
    it("correctly references the dice arguments", () => {
      const rollArgs: DiceProps = {
        dieMax: 20,
        dieAmmount: 3,
        advantage: -2,
        bonus: 2,
        explode: true,
      }
      const dice = createDice(rollArgs)

      expect(dice.args).toMatchObject(rollArgs)
    })

    it("doesn't allow infinite explosion", () => {
      
      const rollArgs: DiceProps = {
        dieMax: 20,
        explode: 9999,
      }
      const dice = createDice(rollArgs)

      expect(dice.args).toMatchObject({ dieMax: 20, explode: 19 })
    })
  })

  describe("roll", () => {

    it("works", () => {
      const options: DiceProps = {
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
      const options: DiceProps = {
        dieMax: 10,
        bonus: 4,
        randomFn: jest.fn(() => 1)
      }
      const dice1 = createDice(options)
      const dice2 = createDice({...options, bonus: 0})
      const dice3 = createDice({...options, bonus: -15})
      
      expect(dice1.roll()).toBe(options.dieMax + options.bonus!)
      expect(dice2.roll()).toBe(options.dieMax)
      expect(dice3.roll()).toBe(options.dieMax - 15)
    })

    describe("with (dis)advantage", () => {
        
      it("works with advantage 1", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(0)
          .mockReturnValueOnce(0.5)
          .mockReturnValueOnce(0.8)
        const options: DiceProps = {
          dieMax: 6,
          bonus: 2,
          advantage: 1,
          randomFn,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(3 + 2)
      })

      it("works with advantage above 1", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(0)
          .mockReturnValueOnce(0.5)
          .mockReturnValueOnce(0.8)
        const options: DiceProps = {
          dieMax: 10,
          advantage: 2,
          randomFn,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(8)
      })

      it("works with disadvantage 1", () => {
        const minThenMax = jest.fn()
        minThenMax.mockReturnValueOnce(0)
        minThenMax.mockReturnValue(1)

        const options: DiceProps = {
          dieMax: 8,
          bonus: 0,
          advantage: -1,
          randomFn: minThenMax,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(options.bonus! + 1)
      })

      it("works with disadvantage above 1", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(0.5)
          .mockReturnValueOnce(0.8)
          .mockReturnValueOnce(0.2)

        const options: DiceProps = {
          dieMax: 10,
          advantage: -2,
          randomFn,
        }
        const diceRoll = createDice(options)
        expect(diceRoll.roll()).toBe(2)
      })

    })

    describe("with multiple die", () => {

      it("works", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 20
          .mockReturnValueOnce(0.5) // 10
          .mockReturnValueOnce(0)   // 1
        
        const options: DiceProps = {
          dieMax: 20,
          dieAmmount: 3,
          randomFn,
        }
        const dice = createDice(options)
        expect(dice.roll()).toBe(20 + 10 + 1)
      })

      it("works with bonus", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 10
          .mockReturnValueOnce(0.5) // 5
          .mockReturnValueOnce(0)   // 1
        
        const options: DiceProps = {
          dieMax: 10,
          dieAmmount: 2,
          bonus: -2,
          randomFn,
        }
        const dice = createDice(options)
        expect(dice.roll()).toBe(10 + 5 - 2)
      })

      it("works with advantage", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 10
          .mockReturnValueOnce(0)   // 1
          .mockReturnValue(0.5)     // 5
        
        const options: DiceProps = {
          dieMax: 10,
          dieAmmount: 2,
          advantage: 1,
          randomFn,
        }
        const dice = createDice(options)
        expect(dice.roll()).toBe(10 + 5)
      })
    })

    describe("with explosion", () => {
      it("works with explosion: true", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 6
          .mockReturnValue(0)       // 1
        const options: DiceProps = {
          dieMax: 6,
          explode: true,
          randomFn
        }
        expect(createDice(options).roll()).toBe(7)
      })

      it("works with explosion: false", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 6
          .mockReturnValue(0)       // 1
        const options: DiceProps = {
          dieMax: 6,
          explode: false,
          randomFn
        }
        expect(createDice(options).roll()).toBe(6)
      })

      it("works with explosion: 1", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(1)   // 6
          .mockReturnValue(0)       // 1
        const options: DiceProps = {
          dieMax: 6,
          explode: 1,
          randomFn
        }
        expect(createDice(options).roll()).toBe(7)
      })

      it("works with explosion over 1 (explosive path)", () => {
        const randomFn = jest.fn()
          .mockReturnValueOnce(4/6) // 4
          .mockReturnValue(0)       // 1
        const options: DiceProps = {
          dieMax: 6,
          explode: 2,
          randomFn,
        }
        expect(createDice(options).roll()).toBe(5)
      })

      it("works with explosion over 1 (non-explosive path)", () => { 
        const randomFn = jest.fn()
          .mockReturnValueOnce(0.5) // 3
          .mockReturnValue(0)       // 1
          const options: DiceProps = {
            dieMax: 6,
            explode: 2,
            randomFn,
          }
          expect(createDice(options).roll()).toBe(3)
      })
    })
  })

  describe("detailedRoll", () => {
    it("works (simple path)", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(0.5)
        .mockReturnValue(0)
      const rollResults = createDice({
        dieMax: 10,
        randomFn,
      }).detailedRoll()

      expect(rollResults.rolls).toEqual([{ value: 5 }])
      expect(rollResults.total).toBe(5)
    })
    
    it("works with dieAmmount", () => {
      const randomFn = jest.fn()
        .mockReturnValueOnce(11/20) // 11
        .mockReturnValueOnce(14/20) // 14
        .mockReturnValue    ( 1/20) // 1

      const rollResults = createDice({
        dieMax: 20,
        dieAmmount: 3,
        randomFn,
      }).detailedRoll()

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

      const rollResults = createDice({
        dieMax: 20,
        advantage: 2,
        randomFn,
      }).detailedRoll()

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

      const rollResults = createDice({
        dieMax: 20,
        advantage: -2,
        randomFn,
      }).detailedRoll()

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

      const rollResults1 = createDice({
        dieMax: 20,
        advantage: 1,
        dieAmmount: 2,
        bonus: 4,
        randomFn: mock1,
      }).detailedRoll()
      const rollResults2 = createDice({
        dieMax: 12,
        advantage: -2,
        dieAmmount: 2,
        bonus: -14,
        randomFn: mock2,
      }).detailedRoll()

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

      const rollResults1 = createDice({
        dieMax: 6,
        explode: 2,
        randomFn: randomFn1,
      }).detailedRoll()
      const rollResults2 = createDice({
        dieMax: 8,
        explode: true,
        randomFn: randomFn2,
      }).detailedRoll()
      
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

      const dice1 = createDice({
        dieMax: 6,
        explode: 3,
        dieAmmount: 3,
        bonus: -2,
        advantage: -2,
        randomFn,
      })

      const rollResults = dice1.detailedRoll()

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
      const diceProps: DiceProps = {
        dieMax: 6,
        explode: 3,
        dieAmmount: 3,
        bonus: -2,
        advantage: -2,
      }
      const rollResults = createDice(diceProps).detailedRoll()

      expect(rollResults.diceArgs).toMatchObject(diceProps)
    })
  })
})
