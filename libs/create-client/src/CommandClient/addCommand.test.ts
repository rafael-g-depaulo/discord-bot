import CreateAddCommand from "./addCommand"
import { mockClientWithMessage } from "../mockDiscord"
import { Client } from "discord.js"
import { CommandState } from "CommandClient"

describe("addCommand", () => {

  const mockAddCommand = (discordClient: Client) => CreateAddCommand({ discordClient }, { commands: [] })

  it("adds the command to commandList", () => {
    const state: CommandState = {
      commands: [],
    }
    const discordClient = mockClientWithMessage("message test")
    const addCommand = CreateAddCommand({ discordClient }, state)

    const id = "test"
    const test = jest.fn()
    const execute = jest.fn()
    const cmd = { id, test, execute }
    addCommand(cmd)

    expect(state.commands.length).toBe(1)
    expect(state.commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ command: cmd, id: cmd.id }),
      ])
    )
  })

  describe("with DefaultCommand", () => {

    it("calls Command.execute when test passes", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = jest.fn(() => true)
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
      // test if test passed and if execute was called correctly
      expect(test).toBeCalledTimes(1)
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

    it("doesn't call Command.execute when test fails", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("test1")
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = jest.fn(() => false)
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
      // test if test failed and if execute was not called
      expect(test).toBeCalledTimes(1)
      expect(execute).toBeCalledTimes(0)
    })
    
    it("calls Command.test with the correct parameters", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = mockAddCommand(discordClient)
      
      // add Command that should pass
      const passingCmd = {
        test: jest.fn(({ content }) => content === "message test"),
        execute: jest.fn(),
        id: "passingCmd",
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
        id: "failingCmd",
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
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = jest.fn(() => true)
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
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
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = /MESSAGE/i
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
      // test if test passed and if execute was called correctly
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

    it("doesn't call Command.execute when test fails", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = /failed regex/i
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
      // test if test failed and if execute was not called
      expect(execute).toBeCalledTimes(0)
    })

    it("calls Command.execute with the correct message parameters", () => {
      // mock client and create addCommand
      const discordClient = mockClientWithMessage("message test")
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = /test/
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
      // test if test passed and if execute was called correctly
      expect(execute).toBeCalledTimes(1)
      expect(execute.mock.calls[0][0]).toMatchObject({ content: "message test" })
    })

    it("calls Command.execute with the regex results", () => {
      // mock client and create addCommand
      const messageContent = `'Hello'   "World"`
      const discordClient = mockClientWithMessage(messageContent)
      const addCommand = mockAddCommand(discordClient)
      
      // run addCommand
      const id = "test"
      const test = /'(\w+)'\s*"(?<groupTest>\w+)"/
      const execute = jest.fn()
      addCommand({ test, execute, id })
      
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
