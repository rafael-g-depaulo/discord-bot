import { Module } from "@discord-bot/create-client"
import createRoles from "./Commands/createRoles"

// test module
export const TestModule: Module = {
  id: "Fantasy Battle",
  commands: [
    createRoles,
  ],
}

export default TestModule
