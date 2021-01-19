import AsciiTable from "ascii-table"

import { capture, concat, optional, optionalSpace } from "@discord-bot/regex"
import { Command, RegexCommand } from "@discord-bot/create-client"
import { createDice, DiceProps, resultString } from "@discord-bot/dice"

import { damageDice, getDmgDiceArg } from "../Models/PlayerCharacter"

import { commandWithoutFlags, damageWords } from "../Utils/regex"
import { logSuccess } from "../Utils/commandLog"
import { monoSpaced } from "../Utils/string/markdown"

const arrayOfSize = (n: number) => Array.from({ length: n }, (_, i) => i)

const getCellStr = (d?: DiceProps) => !d ? "" : `${d.dieAmmount}d${d.dieMax}!`

export const createDamageTable = () => {
  const indexArray = arrayOfSize(damageDice.length)
  const colNum = Math.ceil((indexArray.length-1) / 10)
  const indexMatrix: (string | number)[][] = []

  // add row 0
  indexMatrix[0] = [ 0, getCellStr(damageDice[0]) ]
  
  // add other rows
  arrayOfSize(10).map(i => i+1)
    .map(row => arrayOfSize(colNum)
      .map(col => col * 10 + row) // generate index
      .flatMap(idx => !damageDice[idx] ? [] : [idx, getCellStr(damageDice[idx])])
    )
    .forEach(damageTableRow => indexMatrix.push(damageTableRow))
  
  // version with a for loop
  // for (let i = 1; i <= 10; i++) {
  //   indexMatrix[i] = arrayOfSize(colNum)
  //     .flatMap(j => [j * 10 + i, getCellStr(damageDice[j * 10 + i])])
  // }

  const damageTable = new AsciiTable("Damage Table")
  damageTable.setHeading(arrayOfSize(colNum).flatMap(() => ['Value', 'Dice']))
  indexMatrix.forEach(row => damageTable.addRow(row))

  return damageTable
}

const damageTable = createDamageTable()

export const test: RegexCommand.test = commandWithoutFlags(
  concat(
    damageWords,
    optionalSpace,
    /(?:table|tabela|tab|planilha|sheet)/,
    optionalSpace,
    optional(capture("number", /\d+/)),
  )
)

export const execute: RegexCommand.execute = async (message, regexResult) => {
  const dmgDiceValue = Number(regexResult.groups?.number)

  // if just looking at the damage table
  if (isNaN(dmgDiceValue) || !isFinite(dmgDiceValue)) {
    logSuccess("!dmgTable", message)
    message.channel.send(monoSpaced(damageTable.toString()))
    return
  }
  // if rolling damage
  const dmgArg = getDmgDiceArg(dmgDiceValue)
  const damageDice = createDice(dmgArg)
  logSuccess("!dmgTable", message)
  message.channel.send(resultString(damageDice.detailedRoll()))
}

export const rollDmg: Command = {
  id: "Fantasy Battle: rollDmg",
  test,
  execute,
}

export default rollDmg
