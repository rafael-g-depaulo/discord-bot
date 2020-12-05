import createClient, { Client, Message } from "@discord-bot/create-client"
import { createDice, getDiceRoll, testDiceRoll } from "@discord-bot/dice"

const bot: Client = createClient()

bot.addCommand({
  test: /^!test\s*(?<Rest>.*)$/,
  execute: (msg, result) => {
    const { groups } = result
    msg.author.send(`fuck you and your ${groups!.Rest}`)
  }
})

bot.addCommand({
  test: (msg) => {
    if (msg.content[0] !== "!") return false
    return testDiceRoll(msg.content)
  },
  execute: (msg: Message) => {
    const diceOptions = getDiceRoll(msg.content)
    const dice = createDice(diceOptions)
    const rollResults = dice.detailedRoll()

    const rollOptionsStr = 
      `__**${diceOptions.dieAmmount ?? 1}d${diceOptions.dieMax}${
        !diceOptions.explode ? "" :
        "!".repeat(diceOptions.explode === true ? 1 :diceOptions.explode)
      }${
        diceOptions.bonus === undefined ? "" : 
        diceOptions.bonus > 0 ? " +"+diceOptions.bonus :
        diceOptions.bonus < 0 ? " -"+diceOptions.bonus :
        ""
      }${
        diceOptions.advantage === undefined ? "" :
        diceOptions.advantage > 0
          ? ` adv+${diceOptions.advantage}`
          : ` dis${diceOptions.advantage}`
      }**__: `

    const rollResultStr =
      rollResults.rolls.map(({ value, ignored, exploded }) => 
        ignored ? `~~${value}~~` :
        exploded ? `**${value}!**` :
        `${value}`
      ).join(" + ") + " = " + rollResults.total

    console.log(diceOptions, rollResults)
    msg.reply(rollOptionsStr + rollResultStr)
  },
})

bot.login(process.env.DISCORD_BOT_TOKEN)
  .then((a) => console.log("logged in fucker", a))

export default bot
