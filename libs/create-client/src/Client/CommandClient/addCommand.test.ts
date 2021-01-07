import { Message } from "discord.js"
import { mockMessage } from "@discord-bot/discord-mock"
import { mockClientWithMessage } from "../../mockDiscord"

import CreateAddCommand from "./addCommand"
import { CommandState } from "./types"

describe("addCommand", () => {

  // const mockAddCommand = (discordClient: Client) => CreateAddCommand({ discordClient }, { commands: [] })
  const mockState = (): CommandState => ({
    commandListeners: new Map(),
  })

  it("adds the command to commandList", () => {
    const state = mockState()
    const discordClient = mockClientWithMessage("message test")
    const addCommand = CreateAddCommand({ discordClient }, state)

    const id = "test"
    const test = jest.fn<boolean, [Message]>(() => true)
    const execute = jest.fn()
    const cmd = { id, test, execute }

    addCommand(cmd)

    const commands = Array.from(state.commandListeners.entries())
    expect(state.commandListeners.size).toBe(1)
    expect(commands.length).toBe(1)
    // expect id to be key
    expect(commands[0][0]).toEqual('test')

    // expect value to contain test and execute function
    const [message] = mockMessage()
    commands[0][1].test(message)
    commands[0][1].execute(message)
    expect(test).toBeCalledTimes(1)
    expect(test).toBeCalledWith(message)
    expect(execute).toBeCalledTimes(1)
    expect(execute).toBeCalledWith(message)
  })

  it("works with DefaultCommand", () => {
    // mock client and create addCommand
    const discordClient = mockClientWithMessage("message test")
    const state = mockState()
    const addCommand = CreateAddCommand({ discordClient }, state)
    
    // create mocked command
    const id = "test"
    const test = jest.fn<boolean, [Message]>(() => true)
    const execute = jest.fn()
    const cmd = { id, test, execute }

    addCommand(cmd)

    const commands = Array.from(state.commandListeners.entries())
    expect(state.commandListeners.size).toBe(1)
    expect(commands.length).toBe(1)
    // expect id to be key
    expect(commands[0][0]).toEqual('test')

    // expect value to contain test and execute function
    const [message] = mockMessage()
    commands[0][1].test(message)
    commands[0][1].execute(message)
    expect(test).toBeCalledTimes(1)
    expect(test).toBeCalledWith(message)
    expect(execute).toBeCalledTimes(1)
    expect(execute).toBeCalledWith(message)
  })
  

  it("works with RegexCommand", () => {
    // mock client and create addCommand
    const discordClient = mockClientWithMessage("message test")
    const state = mockState()
    const addCommand = CreateAddCommand({ discordClient }, state)
    
    // create mocked command
    const id = "test"
    const test = /MESSAGE/i
    const execute = jest.fn()
    const cmd = { id, test, execute }
    addCommand({ test, execute, id })

    addCommand(cmd)

    const commands = Array.from(state.commandListeners.entries())
    expect(state.commandListeners.size).toBe(1)
    expect(commands.length).toBe(1)
    // expect id to be key
    expect(commands[0][0]).toEqual('test')

    // expect value to contain test and execute function
    const [message] = mockMessage()
    message.content = "meSSage test"
    expect(commands[0][1].test(message)).toBe(true)
    commands[0][1].execute(message)
    expect(execute).toBeCalledTimes(1)
    expect(execute.mock.calls[0][0]).toBe(message)
    expect(execute.mock.calls[0][1]).toEqual(expect.arrayContaining(["meSSage"]))
  })
})
