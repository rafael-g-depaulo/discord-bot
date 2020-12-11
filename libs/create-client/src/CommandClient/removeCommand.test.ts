import CreateAddCommand from "./addCommand"
import { mockClientWithMessage } from "../mockDiscord"
import { CommandState } from "CommandClient"
import CreateRemoveCommand from "./removeCommand"

describe("removeCommand", () => {

  it("removes a command when given an id", () => {
    const state: CommandState = {
      commands: [],
    }
    const discordClient = mockClientWithMessage("message test")
    const addCommand = CreateAddCommand({ discordClient }, state)
    const removeCommand = CreateRemoveCommand({ discordClient }, state)

    const cmd2 = { test: jest.fn(), execute: jest.fn(), id: "2" }
    const cmd3 = { test: jest.fn(), execute: jest.fn(), id: "3" }
    addCommand(cmd2)
    addCommand(cmd3)

    removeCommand("3")

    expect(state.commands.length).toBe(1)
    expect(state.commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ command: cmd2, id: "2" }),
      ])
    )
  })
  
  it("removes a command when given the command object", () => {
    const state: CommandState = {
      commands: [],
    }
    const discordClient = mockClientWithMessage("message test")
    const addCommand = CreateAddCommand({ discordClient }, state)
    const removeCommand = CreateRemoveCommand({ discordClient }, state)

    const cmd2 = { test: jest.fn(), execute: jest.fn(), id: "2" }
    const cmd3 = { test: jest.fn(), execute: jest.fn(), id: "3" }
    addCommand(cmd2)
    addCommand(cmd3)

    removeCommand(cmd3)

    expect(state.commands.length).toBe(1)
    expect(state.commands).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ command: cmd2, id: "2" }),
      ])
    )
  })
})
