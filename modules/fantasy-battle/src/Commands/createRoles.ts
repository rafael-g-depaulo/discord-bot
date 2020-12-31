import { Command, RegexCommand } from "@discord-bot/create-client"

export const test: RegexCommand.test = /!(?:create-roles|create\s*roles)/i

export const execute: RegexCommand.execute = async (msg) => {

  // if user who used command isn't admin or DM, ignore
  const userRoles = msg.member?.roles.cache
  const isAdmin = msg.member?.hasPermission("ADMINISTRATOR")
  if (!userRoles?.some(role => role.name === "DM") && !isAdmin)
    return msg.channel.send(`sorry, but only DM's or server admins can use the "!create-roles" command`)

  // get server roles
  const roles = await msg.guild?.roles.fetch()
  const roleNames = roles?.cache.array().map(role => role.name)

  // check Player and dm roles
  const hasPlayerRole = roleNames?.includes("Player")
  const hasDmRole = roleNames?.includes("DM")

  // if both roles exist, exit
  if (hasPlayerRole && hasDmRole) return msg.channel.send(`both roles  ("DM" and "Player") already exist, everything's ok!`)

  // if "Player" role doesn't exist, create it
  if (!hasPlayerRole) {
    roles?.create({
      data: {
        name: "Player",
        mentionable: true,
        color: "#e0ba79"
      },
      reason: "role for players of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
    })
    msg.channel.send(`this server didn't have the "Player" role, so i created it`)
  }

  // if "DM" role doesn't exist, create it
  if (!hasDmRole) {
    roles?.create({
      data: {
        name: "DM",
        mentionable: true,
        color: "#3fbef3"
      },
      reason: "role for DM's of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
    })
    msg.channel.send(`this server didn't have the "DM" role, so i created it`)
  }
  return
}

const createRoles: Command = {
  id: "Fantasy Battle: createRoles",
  test,
  execute,
}

export default createRoles
