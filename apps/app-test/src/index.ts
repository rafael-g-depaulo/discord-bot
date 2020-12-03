import createClient, { Client } from "@discord-bot/create-client"

const bot: Client = createClient()

bot.addCommand({
  test: /^!test\s*(?<Rest>.*)$/,
  execute: (msg, result) => {
    const { groups } = result
    msg.author.send(`fuck you and your ${groups!.Rest}`)
  }
})

bot.login(process.env.DISCORD_BOT_TOKEN)
  .then((a) => console.log("logged in fucker", a))

export default bot
