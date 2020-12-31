import { Discord } from "@discord-bot/create-client"

import mockRoleManager, { roleManagerMockConfig } from "./RoleManager"
import { DiscordPartial } from "./types"

export interface guildMockConfig {
  roles: roleManagerMockConfig,
}
export type mockGuild = (props?: DiscordPartial<Discord.Guild>) => [Discord.Guild, guildMockConfig]
export const mockGuild: mockGuild = (props = {}) => { 

  const [ roles, rolesMockConfig ] = mockRoleManager()

  const guild = {
    // mock roles
    roles,
    
    // user-given mocks
    ...props,
  } as Discord.Guild
  
  const guildMockConfig: guildMockConfig = {
    roles: rolesMockConfig,
  }

  return [guild, guildMockConfig]
}

export default mockGuild
