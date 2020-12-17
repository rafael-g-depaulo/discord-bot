import { Command, Message, Module } from "@discord-bot/create-client"
import { createDice, getDiceRoll, resultString, testDiceRoll } from "@discord-bot/dice"

// roll dice command
export const rollDice: Command = {
  id: "Dice Module: roll dice",
  test: (msg: Message) => {
    // only roll if the message starts with "!" and is a dice roll string
    return msg.content[0] === "!" && testDiceRoll(msg.content)
  },
  execute: (msg: Message) => {
    const diceRoll = createDice(getDiceRoll(msg.content))
    msg.reply(resultString(diceRoll.detailedRoll()))
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
