import { add } from "@discord-bot/lib-test"
import { test as testNumber } from "."
import addOne from "addOne"

describe('app test', () => {
  test('test', () => {
    const result: number = add(addOne(21), 1)
    expect(result).toBe(testNumber)
  })
})
