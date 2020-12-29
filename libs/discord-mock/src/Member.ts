import { Discord } from "@discord-bot/create-client"

import mockMemberRoles from "./MemberRoles"
import { DiscordPartial } from "./types"

type setPermissions = (permissions: Discord.PermissionString[]) => void
interface memberMockConfig {
  setPermissions: setPermissions,
}
export type mockMember = (props?: DiscordPartial<Discord.GuildMember>) => [Discord.GuildMember, memberMockConfig]
export const mockMember: mockMember = (props = {}) => { 
  const member = {
    // mock roles
    roles: mockMemberRoles()[0],
    // user-given mocks
    ...props,
  } as Discord.GuildMember

  // mock permissions
  const setPermissions: setPermissions = permissions => {
    member.hasPermission = jest.fn(permission => permissions.includes(`${permission}` as Discord.PermissionString))
  }

  return [member, { setPermissions }]
}

export default mockMember
