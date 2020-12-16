import { DiceRollResults } from "Dice"
import resultString, { rollArgs, rollResultList } from "./resultString"

describe("resultString", () => {

  describe("rollArgs", () => {
    it(`works in simple case (ex: "d20")`, () => {
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 8,
        },
        rolls: [
          { value: 5 },
        ],
        total: 5,
      }
      expect(rollArgs(rollResult1)).toBe("__**d8**__")

      const rollResult2: DiceRollResults = {
        diceArgs: {
          dieMax: 10,
        },
        rolls: [
          { value: 8 },
        ],
        total: 8,
      }
      expect(rollArgs(rollResult2)).toBe("__**d10**__")
    })
    
    it(`works with die ammount (ex: "2d6")`, () => {
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieMax: 4,
          dieAmmount: 3,
        },
        rolls: [
          { value: 2 },
          { value: 4 },
          { value: 1 },
        ],
        total: 7,
      }

      expect(rollArgs(rollResult)).toBe("__**3d4**__")
    })

    it(`works with die explosion (ex: 6d8!)`, () => {
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 10,
          dieAmmount: 2,
          explode: 3,
        },
        rolls: [
          { value: 10, exploded: true },
          { value: 1 },
          { value: 4 },
        ],
        total: 15,
      }

      expect(rollArgs(rollResult1)).toBe("__**2d10!!!**__")

      const rollResult2: DiceRollResults = {
        diceArgs: {
          dieMax: 10,
          dieAmmount: 2,
          explode: true,
        },
        rolls: [
          { value: 10, exploded: true },
          { value: 1 },
          { value: 4 },
        ],
        total: 15,
      }

      expect(rollArgs(rollResult2)).toBe("__**2d10!**__")
    })

    it(`works with bonus ammount (ex: 1d8!+5)`, () => {
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 6,
          dieAmmount: 1,
          bonus: 6,
        },
        rolls: [
          { value: 2 },
        ],
        total: 8,
      }
      expect(rollArgs(rollResult1)).toBe("__**1d6+6**__")
      
      const rollResult2: DiceRollResults = {
        diceArgs: {
          dieMax: 4,
          dieAmmount: 2,
          bonus: -3,
          explode: true,
        },
        rolls: [
          { value: 2 },
          { value: 1 },
        ],
        total: 0,
      }
      expect(rollArgs(rollResult2)).toBe("__**2d4!-3**__")
    })

    it(`works with advantage (ex: 5d20!!+5 adv+2)`, () => {
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 6,
          dieAmmount: 1,
          bonus: 6,
          explode: 2,
          advantage: -2,
        },
        rolls: [
          { value: 2 },
          { value: 5, ignored: true },
          { value: 4, ignored: true },
        ],
        total: 8,
      }
      expect(rollArgs(rollResult1)).toBe("__**1d6!!+6 dis-2**__")
      
      const rollResult2: DiceRollResults = {
        diceArgs: {
          dieMax: 6,
          dieAmmount: 1,
          advantage: 1,
        },
        rolls: [
          { value: 5 },
          { value: 4, ignored: true },
        ],
        total: 8,
      }
      expect(rollArgs(rollResult2)).toBe("__**1d6 adv+1**__")
    })

  })

  describe("rollResult", () => {
    it(`works in simple case (ex: "d20")`, () => {
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieMax: 8,
        },
        rolls: [
          { value: 5 },
        ],
        total: 5,
      }
      expect(rollResultList(rollResult)).toBe("5")
    })

    it(`works with die ammount (ex: "2d6")`, () => {
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieAmmount: 4,
          dieMax: 20,
        },
        rolls: [
          { value: 3 },
          { value: 4 },
          { value: 2 },
          { value: 14 },
        ],
        total: 23,
      }
      expect(rollResultList(rollResult)).toBe("3 + 4 + 2 + 14 = 23")
    })

    it(`works with die explosion (ex: 6d8!)`, () => {
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieMax: 10,
          dieAmmount: 2,
          explode: 3,
        },
        rolls: [
          { value: 8, exploded: true },
          { value: 1 },
          { value: 10, exploded: true },
          { value: 3 },
        ],
        total: 22,
      }

      expect(rollResultList(rollResult)).toBe("**8!** + 1 + **10!** + 3 = 22")
    })

    it(`works with bonus ammount (ex: 1d8!+5)`, () => {
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 6,
          dieAmmount: 1,
          bonus: 6,
        },
        rolls: [
          { value: 2 },
        ],
        total: 8,
      }
      expect(rollResultList(rollResult1)).toBe("2 (+6) = 8")

      const rollResult2: DiceRollResults = {
        diceArgs: {
          dieMax: 4,
          dieAmmount: 2,
          bonus: -3,
        },
        rolls: [
          { value: 2 },
          { value: 1 },
        ],
        total: 0,
      }
      expect(rollResultList(rollResult2)).toBe("2 + 1 (-3) = 0")
    })

    it(`works with advantage (ex: 5d20!!+5 adv+2)`, () => {
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieMax: 6,
          dieAmmount: 1,
          advantage: 1,
          bonus: -2,
        },
        rolls: [
          { value: 5 },
          { value: 4, ignored: true },
        ],
        total: 3,
      }
      expect(rollResultList(rollResult)).toBe("5 + ~~4~~ (-2) = 3")
    })
  })

  describe("resultString", () => {
    it(`works in simple case (ex: "d20")`, () => {
      
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 8,
        },
        rolls: [
          { value: 5 },
        ],
        total: 5,
      }
      expect(resultString(rollResult1)).toBe("__**d8**__: 5")
    })

    it(`works with die ammount (ex: "2d6")`, () => {  
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieAmmount: 4,
          dieMax: 20,
        },
        rolls: [
          { value: 3 },
          { value: 4 },
          { value: 2 },
          { value: 14 },
        ],
        total: 23,
      }
      expect(resultString(rollResult)).toBe("__**4d20**__: 3 + 4 + 2 + 14 = 23")
    })

    it(`works with die explosion (ex: 6d8!)`, () => {
      const rollResult: DiceRollResults = {
        diceArgs: {
          dieMax: 10,
          dieAmmount: 2,
          explode: 3,
        },
        rolls: [
          { value: 8, exploded: true },
          { value: 1 },
          { value: 10, exploded: true },
          { value: 3 },
        ],
        total: 22,
      }

      expect(resultString(rollResult)).toBe("__**2d10!!!**__: **8!** + 1 + **10!** + 3 = 22")
    })

    it(`works with bonus ammount (ex: 1d8!+5)`, () => {
      const rollResult2: DiceRollResults = {
        diceArgs: {
          dieMax: 4,
          dieAmmount: 2,
          bonus: -3,
        },
        rolls: [
          { value: 2 },
          { value: 1 },
        ],
        total: 0,
      }
      expect(resultString(rollResult2)).toBe("__**2d4-3**__: 2 + 1 (-3) = 0")
    })

    it(`works with advantage (ex: 5d20!!+5 adv+2)`, () => {
      const rollResult1: DiceRollResults = {
        diceArgs: {
          dieMax: 6,
          dieAmmount: 2,
          bonus: 7,
          explode: 2,
          advantage: -2,
        },
        rolls: [
          { value: 5, ignored: true },
          { value: 5, exploded: true },
          { value: 2 },
          { value: 6, ignored: true },
          { value: 2 },
        ],
        total: 9,
      }
      expect(resultString(rollResult1)).toBe("__**2d6!!+7 dis-2**__: ~~5~~ + **5!** + 2 + ~~6~~ + 2 (+7) = 9")
    })
  })
})
