import { Discord } from "@discord-bot/create-client"
import { DiscordPartial } from "./types"

interface roleManagerMockConfig {
  setRoles: (roles: string[]) => void
}
export type mockRoleManager = (props?: DiscordPartial<Discord.RoleManager>) => [Discord.RoleManager, roleManagerMockConfig]
export const mockRoleManager: mockRoleManager = (props = {}) => { 
  const roleManager = {
    fetch: () => Promise.resolve(roleManager),
    create: jest.fn(),
    // user-given mocks
    ...props,
  } as Discord.RoleManager

  const setRoles = (roleNames: string[]) => roleManager.cache = new Discord.Collection<string, Discord.Role>(roleNames.map((roleName, i) => [`${i}`, { name: roleName } as Discord.Role]))

  return [roleManager, { setRoles }]
}

export default mockRoleManager
