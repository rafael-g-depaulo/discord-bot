import createClient, { Client,  Message } from "@discord-bot/create-client"

import testModule from "@discord-bot/test-module"
import diceModule from "@discord-bot/dice-module"

const token = process.env.DISCORD_BOT_TOKEN
const bot: Client = createClient({ token })

bot.addModule(testModule)
bot.addModule(diceModule)

export default bot
