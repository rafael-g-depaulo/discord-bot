import createClient, { Client } from "@discord-bot/create-client"

const bot: Client = createClient()

bot.addCommand({
  test: () => true,
  execute: (msg) => {
    msg.author.send("fuck")
  }
})

bot.login(process.env.DISCORD_BOT_TOKEN)
  .then((a) => console.log("logged in fucker", a))

export default bot
