import { createDie } from "./die"

describe('die', () => {

  const bestLuck = () => 1
  const worstLuck = () => 0

  it('creates a functioning dice', () => {
    const d6 = createDie({ dieMax: 6 })
    Array(100).fill(null)
      .forEach(() => {
        expect(d6.roll()).toBeGreaterThanOrEqual(1)
        expect(d6.roll()).toBeLessThanOrEqual(6)
      })
  })

  it("results in 1 with a 0 from the RNG function", () => {
    const rigged_d6 = createDie({ dieMax: 6, randomFn: worstLuck })
    expect(rigged_d6.roll()).toBe(1)
  })

  it("results in dieMax with a 1 from the RNG function", () => {
    const rigged_d8 = createDie({ dieMax: 8, randomFn: bestLuck })
    expect(rigged_d8.roll()).toBe(8)
  })
})
