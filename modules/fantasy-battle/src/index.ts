import { Module } from "@discord-bot/create-client"

import createRoles from "./Commands/createRoles"
import createCharacter from "./Commands/createCharacter"
import listChars from "./Commands/listChars"
import setActiveChar from "./Commands/setActiveChar"
import deleteCharacter from "./Commands/deleteCharacter"
import setAtkAttribute from "./Commands/setAtkAttribute"
import rollAttribute from "./Commands/rollAttribute"
import rollDmg from "./Commands/rollDmg"
import setAttribute from "./Commands/setAttribute"
import changeResource from "./Commands/changeResource"
import setResourceScaling from "./Commands/setResourceScaling"
import dmgTable from "./Commands/dmgTable"
import viewBio from "./Commands/viewBio"
import viewStats from "./Commands/viewStats"

export { connect as dbConnect } from "@discord-bot/mongo"

// test module
export const FantasyBattle: Module = {
  id: "Fantasy Battle",
  commands: [
    createRoles,
    createCharacter,
    listChars,
    setActiveChar,
    deleteCharacter,
    setAtkAttribute,
    rollAttribute,
    rollDmg,
    setAttribute,
    changeResource,
    setResourceScaling,
    dmgTable,
    viewBio,
    viewStats,
  ],
}

export default FantasyBattle
