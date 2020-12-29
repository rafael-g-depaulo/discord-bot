
// import { mockMessage } from "Utils/mockDiscord"
import { test, execute } from "./createRoles"

describe("Command: createRoles", () => {
  // let message = mockMessage({ content: "aaaaa" })
  // afterEach(() => {
  //   message = mockMessage({ content: "aaaaa" })
  // })

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
      // const message = mockMessage({ content: "!create-roles" })
      // const channelSend = jest.spyOn(message.channel, "send")
      // // execute command
      // execute(message, test.exec(message.content)!)
      
      // expect(channelSend.mock.calls.length).toBe(1)
      // expect(channelSend.mock.calls[0][0]).toBe("sorry, but only DM's or server admins can use the \"!create-roles\" command")
    })
  })
})
