
// import { mockMessage } from "Utils/mockDiscord"
// import MockDiscord from "Utils/mockDiscord"
// import { Discord } from "@discord-bot/create-client"

// import { mock, instance, verify, when } from "ts-mockito"

import { Discord } from "@discord-bot/create-client"
import { mockMemberRoles, mockMember, mockMessage, mockGuild, mockRoleManager } from "Utils/mockMessage"
import { test, execute } from "./createRoles"

describe("Command: createRoles", () => {
  // let mockedClientClass: Discord.Client
  // let mockedClientInstance: Discord.Client
  
  // let mockedGuildClass: Discord.Guild
  // let mockedGuildInstance: Discord.Guild
  
  // let mockedChannelClass: Discord.Channel
  // let mockedChannelInstance: Discord.Channel
  
  // let mockedGuildChannelClass: Discord.GuildChannel
  // let mockedGuildChannelInstance: Discord.GuildChannel
  
  // let mockedTextChannelClass: Discord.TextChannel
  // let mockedTextChannelInstance: Discord.TextChannel
  
  // let mockedUserClass: Discord.User
  // let mockedUserInstance: Discord.User
  
  // let mockedGuildMemberClass: Discord.GuildMember
  // let mockedGuildMemberInstance: Discord.GuildMember
  
  // let mockedMessageClass: Discord.Message
  // let mockedMessageInstance: Discord.Message
  beforeEach(() => {
    
    // Discord.Client
    // Discord.Guild
    // Discord.Channel
    // Discord.GuildChannel
    // Discord.TextChannel
    // Discord.User
    // Discord.GuildMember
    // Discord.Message

    // mockedClientClass = mock(Discord.Client)
    // mockedClientInstance = instance(mockedClientClass)
    
    // mockedGuildClass = mock(Discord.Guild)
    // mockedGuildInstance = instance(mockedGuildClass)
    
    // mockedChannelClass = mock(Discord.Channel)
    // mockedChannelInstance = instance(mockedChannelClass)
    
    // mockedGuildChannelClass = mock(Discord.GuildChannel)
    // mockedGuildChannelInstance = instance(mockedGuildChannelClass)
    
    // mockedTextChannelClass = mock(Discord.TextChannel)
    // mockedTextChannelInstance = instance(mockedTextChannelClass)
    
    // mockedUserClass = mock(Discord.User)
    // mockedUserInstance = instance(mockedUserClass)
    
    // mockedGuildMemberClass = mock(Discord.GuildMember)
    // mockedGuildMemberInstance = instance(mockedGuildMemberClass)
    
    // mockedMessageClass = mock(Discord.Message)
    // mockedMessageInstance = instance(mockedMessageClass)
    // // mockedMessageInstance.channel = mockedTextChannelInstance
  })

  describe(".test", () => {
    it("works", () => {
      expect("!create-roles").toMatch(test)
      expect("!Create-Roles").toMatch(test)
      expect("!createRoles").toMatch(test)
      expect("!createroles").toMatch(test)
      expect("!create roles").toMatch(test)
      expect("!create     \t   roles").toMatch(test)
    })
  })

  describe(".execute", () => {
    it("doesn't allow non-admin non-DMs to create roles", async () => {
      // mock user roles (non-DM)
      const [roles, setRoles] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (not ADMIN)
      const [member, setPermissions] = mockMember({ roles })
      setPermissions([])

      // mock message
      const message = mockMessage({ member })
      message.content = "!create-roles"
      
      // execute command
      await execute(message, test.exec(message.content)!)

      expect(message.channel.send).toBeCalledTimes(1)
      expect(message.channel.send).toBeCalledWith(`sorry, but only DM's or server admins can use the "!create-roles" command`)
    })

    it("allows admin non-DMs to create roles", async () => {
      // mock user roles (non-DM)
      const [roles, setRoles] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (ADMIN)
      const [member, setPermissions] = mockMember({ roles })
      setPermissions(["ADMINISTRATOR"])

      // mock role manager
      const [guildRoles, setGuildRoles] = mockRoleManager()
      setGuildRoles([])
      
      // mock guild
      const guild = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const message = mockMessage({ member, guild })
      message.content = "!create-roles"

      // spy on message.channel.send and roles.create
      const channelSendMock = jest.spyOn(message.channel, "send")
      const createRole = jest.spyOn(message.guild!.roles, "create")
      
      // execute command
      await execute(message, test.exec(message.content)!)

      // expect roles to be created
      expect(createRole).toBeCalledTimes(2)
      expect(createRole.mock.calls[0]).toEqual([{
        data: {
          name: "Player",
          mentionable: true,
          color: "#e0ba79"
        },
        reason: "role for players of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
      }])
      expect(createRole.mock.calls[1]).toEqual([{
        data: {
          name: "DM",
          mentionable: true,
          color: "#3fbef3",
        },
        reason: "role for DM's of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
      }])

      // expect message reponses
      expect(channelSendMock).toBeCalledTimes(2)
      expect(channelSendMock.mock.calls[0]).toEqual([`this server didn't have the "Player" role, so i created it`])
      expect(channelSendMock.mock.calls[1]).toEqual([`this server didn't have the "DM" role, so i created it`])
    })

    it("allows non-admin DMs to create roles", async () => {
      // mock user roles (non-DM)
      const [roles, setRoles] = mockMemberRoles()
      setRoles(["DM"])

      // mock member permissions (ADMIN)
      const [member, setPermissions] = mockMember({ roles })
      setPermissions([])

      // mock role manager
      const [guildRoles, setGuildRoles] = mockRoleManager()
      setGuildRoles([])
      
      // mock guild
      const guild = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const message = mockMessage({ member, guild })
      message.content = "!create-roles"

      // spy on message.channel.send and roles.create
      const channelSendMock = jest.spyOn(message.channel, "send")
      const createRole = jest.spyOn(message.guild!.roles, "create")
      
      // execute command
      await execute(message, test.exec(message.content)!)

      // expect roles to be created
      expect(createRole).toBeCalledTimes(2)
      expect(createRole.mock.calls[0]).toEqual([{
        data: {
          name: "Player",
          mentionable: true,
          color: "#e0ba79"
        },
        reason: "role for players of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
      }])
      expect(createRole.mock.calls[1]).toEqual([{
        data: {
          name: "DM",
          mentionable: true,
          color: "#3fbef3",
        },
        reason: "role for DM's of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
      }])

      // expect message reponses
      expect(channelSendMock).toBeCalledTimes(2)
      expect(channelSendMock.mock.calls[0]).toEqual([`this server didn't have the "Player" role, so i created it`])
      expect(channelSendMock.mock.calls[1]).toEqual([`this server didn't have the "DM" role, so i created it`])
    })

    it(`creates only "DM" role if "Player" role already present`, async () => {
      // mock user roles (non-DM)
      const [roles, setRoles] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (ADMIN)
      const [member, setPermissions] = mockMember({ roles })
      setPermissions(["ADMINISTRATOR"])

      // mock role manager
      const [guildRoles, setGuildRoles] = mockRoleManager()
      setGuildRoles(["Player"])
      
      // mock guild
      const guild = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const message = mockMessage({ member, guild })
      message.content = "!create-roles"

      // spy on message.channel.send and roles.create
      const channelSendMock = jest.spyOn(message.channel, "send")
      const createRole = jest.spyOn(message.guild!.roles, "create")
      
      // execute command
      await execute(message, test.exec(message.content)!)

      // expect roles to be created
      expect(createRole).toBeCalledTimes(1)
      expect(createRole.mock.calls[0]).toEqual([{
        data: {
          name: "DM",
          mentionable: true,
          color: "#3fbef3",
        },
        reason: "role for DM's of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
      }])

      // expect message reponses
      expect(channelSendMock).toBeCalledTimes(1)
      expect(channelSendMock.mock.calls[0]).toEqual([`this server didn't have the "DM" role, so i created it`])
    })

    it(`creates only "Player" role if "DM" role already present`, async () => {
      // mock user roles (non-DM)
      const [roles, setRoles] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (ADMIN)
      const [member, setPermissions] = mockMember({ roles })
      setPermissions(["ADMINISTRATOR"])

      // mock role manager
      const [guildRoles, setGuildRoles] = mockRoleManager()
      setGuildRoles(["DM"])
      
      // mock guild
      const guild = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const message = mockMessage({ member, guild })
      message.content = "!create-roles"

      // spy on message.channel.send and roles.create
      const channelSendMock = jest.spyOn(message.channel, "send")
      const createRole = jest.spyOn(message.guild!.roles, "create")
      
      // execute command
      await execute(message, test.exec(message.content)!)

      // expect roles to be created
      expect(createRole).toBeCalledTimes(1)
      expect(createRole.mock.calls[0]).toEqual([{
        data: {
          name: "Player",
          mentionable: true,
          color: "#e0ba79"
        },
        reason: "role for players of OL: Fantasy Battle RPG (role created by Dice-roller Bot, made by Ragan)",
      }])

      // expect message reponses
      expect(channelSendMock).toBeCalledTimes(1)
      expect(channelSendMock.mock.calls[0]).toEqual([`this server didn't have the "Player" role, so i created it`])
    })
  })
})
