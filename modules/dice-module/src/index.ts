import { Command, Message, Module } from "@discord-bot/create-client"
import { createDice, getDiceRoll, resultString, testDiceRoll, rollArgsString } from "@discord-bot/dice"
import console from "@discord-bot/logging"

// roll dice command
export const rollDice: Command = {
  id: "Dice Module: Roll Dice",
  test: (msg: Message) => {
    // only roll if the message starts with "!" and is a dice roll string
    return msg.content[0] === "!" && testDiceRoll(msg.content)
  },
  execute: (msg: Message) => {
    const diceRoll = createDice(getDiceRoll(msg.content))
    const rollResult = diceRoll.detailedRoll()
    msg.reply(resultString(rollResult))
    console.info(`Dice Module: Roll Dice: rolling ${rollArgsString(rollResult)} for user ${msg.author.username}.`)
  }
}

// test module
export const TestModule: Module = {
  id: "Dice Module",
  commands: [
    rollDice,
  ],
}

export default TestModule
