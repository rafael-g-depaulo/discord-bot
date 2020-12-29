import { Message } from "@discord-bot/create-client"
import { MockMessage } from "jest-discordjs-mocks"
import { test } from "./createCharacter"

describe("Command: createCharacter", () => {
  let message: Message = new MockMessage()
  afterEach(() => {
    message = new MockMessage()
  })

  describe(".test", () => {
    it("works", () => {
      expect("!create-chars").toMatch(test)
    })
  })

  describe(".execute", () => {
    it("works", () => {
      message.content = "!"


    })
  })
})
