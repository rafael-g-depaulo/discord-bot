import { Module } from "@discord-bot/create-client"

import createRoles from "./Commands/createRoles"
import createCharacter from "./Commands/createCharacter"
import listChars from "./Commands/listChars"
import setActiveChar from "./Commands/setActiveChar"
import deleteCharacter from "./Commands/deleteCharacter"
import setAtkAttribute from "./Commands/setAtkAttribute"
import rollAttribute from "./Commands/rollAttribute"
import rollDmg from "./Commands/rollDmg"
import rollAtk from "./Commands/rollAtk"
import setAttribute from "./Commands/setAttribute"
import changeResource from "./Commands/changeResource"
import setResourceScaling from "./Commands/setResourceScaling"
import setDefenseScaling from "./Commands/setDefenseScaling"
import dmgTable from "./Commands/dmgTable"
import viewBio from "./Commands/viewBio"
import viewStats from "./Commands/viewStats"
import takeDamage from "./Commands/takeDamage"
import rollInitiative from "./Commands/rollInitiative"
import setLevel from "./Commands/setLevel"
import shortRest from "./Commands/shortRest"
import longRest from "./Commands/longRest"
import help from "./Commands/help"
import createBackup from "./Commands/createBackup"
import restoreBackup from "./Commands/restoreBackup"

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
    rollDmg,
    rollAtk,
    setAttribute,
    changeResource,
    setResourceScaling,
    setDefenseScaling,
    dmgTable,
    viewBio,
    viewStats,
    takeDamage,
    rollInitiative,
    setLevel,
    shortRest,
    longRest,
    help,
    createBackup,
    restoreBackup,
    rollAttribute,
  ],
}

export default FantasyBattle
