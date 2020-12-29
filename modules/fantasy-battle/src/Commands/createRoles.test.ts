import { MockMessage } from "jest-discordjs-mocks"

import { test, execute } from "./createRoles"

describe("Command: createRoles", () => {
  let message = new MockMessage()
  afterEach(() => {
    message = new MockMessage()
  })

  describe(".test", () => {
    it("works", () => {
      expect("!create-roles").toMatch(test)
      expect("!Create-Roles").toMatch(test)
      expect("!createRoles").toMatch(test)
      expect("!createroles").toMatch(test)
      expect("!create roles").toMatch(test)
      expect("!create     \t   roles").toMatch(test)
    })
  })

  describe(".execute", () => {
    it("works", () => {
      message.content = "!create-roles"

      // execute command
      // execute(message, test.exec(message.content)!)

      // expect(message.channel.send).toBeCalledWith("fsdfsfd")
    })
  })
})
