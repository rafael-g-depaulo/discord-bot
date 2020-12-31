import {
  mockMemberRoles,
  mockRoleManager,
  mockGuild,
  mockMember,
  mockMessage,
} from "@discord-bot/discord-mock"

import { test, execute } from "./createRoles"

describe("Command: createRoles", () => {

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
      const [roles, { setRoles }] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (not ADMIN)
      const [member, { setPermissions }] = mockMember({ roles })
      setPermissions([])

      // mock message
      const [message] = mockMessage({ member })
      message.content = "!create-roles"
      
      // execute command
      await execute(message, test.exec(message.content)!)

      expect(message.channel.send).toBeCalledTimes(1)
      expect(message.channel.send).toBeCalledWith(`sorry, but only DM's or server admins can use the "!create-roles" command`)
    })

    it("allows admin non-DMs to create roles", async () => {
      // mock user roles (non-DM)
      const [roles, { setRoles }] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (ADMIN)
      const [member, { setPermissions }] = mockMember({ roles })
      setPermissions(["ADMINISTRATOR"])

      // mock role manager
      const [guildRoles, { setRoles: setGuildRoles }] = mockRoleManager()
      setGuildRoles([])
      
      // mock guild
      const [guild] = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const [message] = mockMessage({ member, guild })
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
      const [roles, { setRoles }] = mockMemberRoles()
      setRoles(["DM"])

      // mock member permissions (ADMIN)
      const [member, { setPermissions }] = mockMember({ roles })
      setPermissions([])

      // mock role manager
      const [guildRoles, { setRoles: setGuildRoles }] = mockRoleManager()
      setGuildRoles([])
      
      // mock guild
      const [guild] = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const [message] = mockMessage({ member, guild })
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
      const [roles, { setRoles }] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (ADMIN)
      const [member, { setPermissions }] = mockMember({ roles })
      setPermissions(["ADMINISTRATOR"])

      // mock role manager
      const [guildRoles, { setRoles: setGuildRoles }] = mockRoleManager()
      setGuildRoles(["Player"])
      
      // mock guild
      const [guild] = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const [message] = mockMessage({ member, guild })
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
      const [roles, { setRoles }] = mockMemberRoles()
      setRoles(["Player"])

      // mock member permissions (ADMIN)
      const [member, { setPermissions }] = mockMember({ roles })
      setPermissions(["ADMINISTRATOR"])

      // mock role manager
      const [guildRoles, { setRoles: setGuildRoles }] = mockRoleManager()
      setGuildRoles(["DM"])
      
      // mock guild
      const [guild] = mockGuild({
        roles: guildRoles,
      })
      
      // mock message
      const [message] = mockMessage({ member, guild })
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
