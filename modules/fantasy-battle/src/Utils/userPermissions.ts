import { GuildMember } from "discord.js"

export const isPlayer = (member: GuildMember | null): boolean => {
  const roleNames = member?.roles.cache.array().map(r => r.name)
  return roleNames?.some(roleName => /player/i.test(roleName)) ?? false
}

export const isDm = (member: GuildMember | null): boolean => {
  const roleNames = member?.roles.cache.array().map(r => r.name)
  return roleNames?.some(roleName => /DM/i.test(roleName)) ?? false
}

export const isAdmin = (member: GuildMember | null): boolean => {
  return member?.hasPermission("ADMINISTRATOR") ?? false
}
