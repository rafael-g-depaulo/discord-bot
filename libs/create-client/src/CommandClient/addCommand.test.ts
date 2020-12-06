import CreateAddCommand from "./addCommand"
import { mockClientWithMessage } from "../mockDiscord"

describe("addCommand", () => {

  describe("with DefaultCommand", () => {

    it("calls Command.execute when test passes", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = jest.fn(() => true)
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test passed and if execute was called correctly
      expect(test).toBeCalledTimes(1)
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

    it("doesn't call Command.execute when test fails", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("test1")
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = jest.fn(() => false)
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test failed and if execute was not called
      expect(test).toBeCalledTimes(1)
      expect(execute).toBeCalledTimes(0)
    })
    
    it("calls Command.test with the correct parameters", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = CreateAddCommand({ discordClient })
      
      // add Command that should pass
      const passingCmd = {
        test: jest.fn(({ content }) => content === "message test"),
        execute: jest.fn(),
      }
      addCommand(passingCmd)
      
      // test if command passes
      expect(passingCmd.test).toBeCalledTimes(1)
      expect(passingCmd.test).toHaveReturnedWith(true)
      expect(passingCmd.execute).toBeCalledTimes(1)

      // add Command that should fail
      const failingCmd = {
        test: jest.fn(({ content }) => content !== "message test"),
        execute: jest.fn(),
      }
      addCommand(failingCmd)
      
      // test if command passes
      expect(failingCmd.test).toBeCalledTimes(1)
      expect(failingCmd.test).toHaveReturnedWith(false)
      expect(failingCmd.execute).toBeCalledTimes(0)
    })

    it("calls Command.execute with the correct parameters", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = jest.fn(() => true)
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test passed and if execute was called correctly
      expect(test).toBeCalledTimes(1)
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

  })

  describe("with RegexCommand", () => {

    it("calls Command.execute when test passes", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = /MESSAGE/i
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test passed and if execute was called correctly
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

    it("doesn't call Command.execute when test fails", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = /failed regex/i
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test failed and if execute was not called
      expect(execute).toBeCalledTimes(0)
    })

    it("calls Command.execute with the correct message parameters", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = /test/
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test passed and if execute was called correctly
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

    it("calls Command.execute with the regex results", () => {
      // mock client and create addCommand
      const messageContent = `'Hello'   "World"`
      const discordClient = mockClientWithMessage(messageContent)
      const addCommand = CreateAddCommand({ discordClient })
      
      // run addCommand
      const test = /'(\w+)'\s*"(?<groupTest>\w+)"/
      const execute = jest.fn()
      addCommand({ test, execute })
      
      // test if test passed and if execute was called correctly
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: messageContent })

      // full regex match
      expect(execute.mock.calls[0][1][0]).toEqual(messageContent)
      // first capture group match
      expect(execute.mock.calls[0][1][1]).toEqual("Hello")
      // named capture group matches
      expect(execute.mock.calls[0][1].groups).toEqual({ groupTest: "World" })
    })
  })
})
