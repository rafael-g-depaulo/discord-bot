import createClient, { Client,  Message } from "@discord-bot/create-client"
import { createDice, getDiceRoll, testDiceRoll, resultString } from "@discord-bot/dice"

const token = process.env.DISCORD_BOT_TOKEN
const bot: Client = createClient({ token })

bot.addCommand({
  id: "test_command",
  test: /^!test\s*(?<Rest>.*)$/,
  execute: (msg, result) => {
    const { groups } = result
    msg.author.send(`fuck you and your ${groups!.Rest}`)
  }
})

bot.addCommand({
  id: "roll_dice",
  test: (msg) => {
    if (msg.content[0] !== "!") return false
    return testDiceRoll(msg.content)
  },
  execute: (msg: Message) => {
    const diceOptions = getDiceRoll(msg.content)
    const dice = createDice(diceOptions)
    const rollResults = dice.detailedRoll()
    const rollResultStr = resultString(rollResults)

    msg.reply(rollResultStr)
  },
})

export default bot
