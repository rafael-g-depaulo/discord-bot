import { Discord } from "@discord-bot/create-client"

import mockMemberRoles, { memberRolesMockConfig } from "./MemberRoles"
import { DiscordPartial } from "./types"

type setPermissions = (permissions: Discord.PermissionString[]) => void
export interface memberMockConfig {
  setPermissions: setPermissions,
  roles: memberRolesMockConfig,
}
export type mockMember = (props?: DiscordPartial<Discord.GuildMember>) => [Discord.GuildMember, memberMockConfig]
export const mockMember: mockMember = (props = {}) => { 
  
  const [ roles, rolesMockConfig ] = mockMemberRoles()

  const member = {
    // mock roles
    roles,
    // user-given mocks
    ...props,
  } as Discord.GuildMember

  // mock permissions
  const setPermissions: setPermissions = permissions => {
    member.hasPermission = jest.fn(permission => permissions.includes(`${permission}` as Discord.PermissionString))
  }
  setPermissions([])

  const memberMockConfig: memberMockConfig = {
    roles: rolesMockConfig,
    setPermissions,
  }


  return [member, memberMockConfig]
}

export default mockMember
