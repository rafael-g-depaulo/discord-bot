import createClient from "@discord-bot/create-client"

const bot = createClient()

bot.login(process.env.DISCORD_BOT_TOKEN)
  .then((a) => console.log("logged in fucker", a))
