import { Discord } from "@discord-bot/create-client"
import { string } from "yargs"

type Without<T, K> = Pick<T, Exclude<keyof T, K>>;

type DiscordPartial<T> = Partial<Without<T, "valueOf">>

export const mockAuthor = (props: DiscordPartial<Discord.User> = {}) => ({
  // default mock props
  id: "123456",
  username: "username",

  // user-given mocks
  ...props,
}) as Discord.User

export const mockChannel = (props: DiscordPartial<Discord.TextChannel> = {}) => ({
  send: jest.fn(),

  // user-given mocks
  ...props,
})

export const mockMemberRoles = (props: DiscordPartial<Discord.GuildMemberRoleManager> = {}): [Discord.GuildMemberRoleManager, (roles: string[]) => Discord.Collection<string, Discord.Role>] => {
  let memberRoles = {
    ...props,
  } as Discord.GuildMemberRoleManager
  
  const setRoles = (roles: string[]) => memberRoles.cache = new Discord.Collection<string, Discord.Role>(roles.map((roleName, i) => [`${i}`, { name: roleName } as Discord.Role]))

  // set empty roles
  setRoles([])

  return [memberRoles, setRoles]
}

export const mockRoleManager = (props: DiscordPartial<Discord.RoleManager> = {}): [Discord.RoleManager, (roles: string[]) => void] => {
  
  const roleManager = {
    fetch: () => Promise.resolve(roleManager),
    create: jest.fn(),
    // user-given mocks
    ...props,
  } as Discord.RoleManager

  // const roles: Discord.RoleManager = {

  // } as Discord.RoleManager
  
  const setRoles = (roleNames: string[]) => roleManager.cache = new Discord.Collection<string, Discord.Role>(roleNames.map((roleName, i) => [`${i}`, { name: roleName } as Discord.Role]))

  setRoles([])

  return [roleManager, setRoles]
}

export const mockGuild = (props: DiscordPartial<Discord.Guild> = {}) => {
  const guild = {
    // mock roles
    roles: mockRoleManager()[0],
    
    // user-given mocks
    ...props,
  } as Discord.Guild

  return guild
}

type setPermissions = (permissions: Discord.PermissionString[]) => void

export const mockMember = (props: DiscordPartial<Discord.GuildMember> = {}): [Discord.GuildMember, setPermissions] => {
  const member = ({
    // mock roles
    roles: mockMemberRoles()[0],

    // hasPermission: jest.fn(),
    
    // user-given mocks
    ...props,
  }) as Discord.GuildMember
  
  // mock permissions
  const setPermissions: setPermissions = permissions => {
    member.hasPermission = jest.fn(permission => permissions.includes(`${permission}` as Discord.PermissionString))
  }

  setPermissions([])

  return [member, setPermissions]
}

export const mockMessage = (props: DiscordPartial<Discord.Message> = {}) => ({
  // mock content
  content: "",

  // mock author
  author: mockAuthor(),

  // mock member
  member: mockMember(),

  // mock guild
  guild: mockGuild(),

  // mock channel
  channel: mockChannel(),
  
  // user-given mocks
  ...props,
}) as Discord.Message
