import { Discord } from "@discord-bot/create-client"

import mockRoleManager from "./RoleManager"
import { DiscordPartial } from "./types"

interface guildMockConfig {
}
export type mockGuild = (props?: DiscordPartial<Discord.Guild>) => [Discord.Guild, guildMockConfig]
export const mockGuild: mockGuild = (props = {}) => { 
  const guild = {
    // mock roles
    roles: mockRoleManager()[0],
    
    // user-given mocks
    ...props,
  } as Discord.Guild

  return [guild, {}]
}

export default mockGuild
