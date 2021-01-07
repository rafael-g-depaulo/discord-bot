import CreateAddCommand from "./addCommand"
import { mockClientWithMessage } from "../../mockDiscord"
import { CommandState } from "./types"
import CreateRemoveCommand from "./removeCommand"

describe("removeCommand", () => {

  it("removes a command when given an id", () => {
    const state: CommandState = {
      commandListeners: new Map(),
    }
    const discordClient = mockClientWithMessage("message test")
    const addCommand = CreateAddCommand({ discordClient }, state)
    const removeCommand = CreateRemoveCommand({ discordClient }, state)

    const cmd2 = { test: jest.fn(), execute: jest.fn(), id: "2" }
    const cmd3 = { test: jest.fn(), execute: jest.fn(), id: "3" }
    addCommand(cmd2)
    addCommand(cmd3)

    removeCommand("3")

    const commands = Array.from(state.commandListeners.entries())
    expect(state.commandListeners.size).toBe(1)
    expect(commands[0][0]).toEqual('2')
  })
  
  it("removes a command when given the command object", () => {
    const state: CommandState = {
      commandListeners: new Map(),
    }
    const discordClient = mockClientWithMessage("message test")
    const addCommand = CreateAddCommand({ discordClient }, state)
    const removeCommand = CreateRemoveCommand({ discordClient }, state)

    const cmd2 = { test: jest.fn(), execute: jest.fn(), id: "2" }
    const cmd3 = { test: jest.fn(), execute: jest.fn(), id: "3" }
    addCommand(cmd2)
    addCommand(cmd3)

    removeCommand(cmd3)

    const commands = Array.from(state.commandListeners.entries())
    expect(state.commandListeners.size).toBe(1)
    expect(commands[0][0]).toEqual('2')
  })
})
