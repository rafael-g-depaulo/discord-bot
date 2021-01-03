import { Module } from "@discord-bot/create-client"
import connect from "./Db"

import createRoles from "./Commands/createRoles"
import createCharacter from "./Commands/createCharacter"
import listChars from "./Commands/listChars"
import setActiveChar from "./Commands/setActiveChar"
import deleteCharacter from "./Commands/deleteCharacter"
import setAtkAttribute from "./Commands/setAtkAttribute"

export const dbConnect = connect

// test module
export const TestModule: Module = {
  id: "Fantasy Battle",
  commands: [
    createRoles,
    createCharacter,
    listChars,
    setActiveChar,
    deleteCharacter,
    setAtkAttribute,
  ],
}

export default TestModule
