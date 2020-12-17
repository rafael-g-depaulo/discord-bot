import { Command, Module } from "@discord-bot/create-client"

// test command
export const testCommand: Command = {
  id: "test_command",
  test: /^!test\s*(?<Rest>.*)$/,
  execute: (msg, result) => {
    const { groups } = result
    msg.author.send(`fuck you and your ${groups!.Rest}`)
  }
}

// test module
export const TestModule: Module = {
  id: "test_module",
  commands: [
    testCommand,
  ],
}

export default TestModule
