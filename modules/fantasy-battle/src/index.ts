import { Module } from "@discord-bot/create-client"
import createRoles from "./Commands/createRoles"
import createCharacter from "./Commands/createCharacter"
import connect from "./Db"

export const dbConnect = connect

// test module
export const TestModule: Module = {
  id: "Fantasy Battle",
  commands: [
    createRoles,
    createCharacter,
  ],
}

export default TestModule
