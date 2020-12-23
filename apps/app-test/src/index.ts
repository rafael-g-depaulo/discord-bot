import createClient, { Client } from "@discord-bot/create-client"

import testModule from "@discord-bot/test-module"
import diceModule from "@discord-bot/dice-module"
import fantasyBattle, { dbConnect } from "@discord-bot/fantasy-battle"

const token = process.env.DISCORD_BOT_TOKEN
const bot: Client = createClient({ token })

bot.addModule(testModule)
bot.addModule(diceModule)

dbConnect()
  .then(() => bot.addModule(fantasyBattle))

export default bot
