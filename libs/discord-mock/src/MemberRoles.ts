import { Discord } from "@discord-bot/create-client"
import { DiscordPartial } from "./types"

export interface memberRolesMockConfig {
  setRoles: (roles: string[]) => void
}
export type mockMemberRoles = (props?: DiscordPartial<Discord.GuildMemberRoleManager>) => [Discord.GuildMemberRoleManager, memberRolesMockConfig]
export const mockMemberRoles: mockMemberRoles = (props = {}) => {
  let memberRoles = {
    ...props,
  } as Discord.GuildMemberRoleManager

  const setRoles = (roles: string[]) => memberRoles.cache = new Discord.Collection<string, Discord.Role>(roles.map((roleName, i) => [`${i}`, { name: roleName } as Discord.Role]))

  // set empty roles
  setRoles([])

  return [memberRoles, { setRoles }]
}

export default mockMemberRoles
