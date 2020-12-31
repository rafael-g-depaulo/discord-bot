import { Module } from "@discord-bot/create-client"
import connect from "./Db"

import createRoles from "./Commands/createRoles"
import createCharacter from "./Commands/createCharacter"
import listChars from "./Commands/listChars"

export const dbConnect = connect

// test module
export const TestModule: Module = {
  id: "Fantasy Battle",
  commands: [
    createRoles,
    createCharacter,
    listChars,
  ],
}

export default TestModule
