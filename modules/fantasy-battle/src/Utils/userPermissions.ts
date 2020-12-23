import { GuildMember } from "discord.js"

export const isPlayer = (member: GuildMember): boolean => {
  const roleNames = member?.roles.cache.array().map(r => r.name)
  return roleNames?.includes("Player") ?? false
}

export const isDm = (member: GuildMember): boolean => {
  const roleNames = member?.roles.cache.array().map(r => r.name)
  return roleNames?.includes("Dm") ?? false
}

export const isAdmin = (member: GuildMember): boolean => {
  return member?.hasPermission("ADMINISTRATOR") ?? false
}
