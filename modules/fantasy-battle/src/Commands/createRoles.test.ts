
// import { mockMessage } from "Utils/mockDiscord"
// import MockDiscord from "Utils/mockDiscord"
// import { Discord } from "@discord-bot/create-client"

// import { mock, instance, verify, when } from "ts-mockito"

import { Discord } from "@discord-bot/create-client"
import { mockMemberRoles, mockMember, mockMessage } from "Utils/mockMessage"
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
    it("doesn't allow non-admin non-DMs to create roles", () => {

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
      execute(message, test.exec(message.content)!)

      expect(message.channel.send).toBeCalledTimes(1)
      expect(message.channel.send).toBeCalledWith(`sorry, but only DM's or server admins can use the "!create-roles" command`)
    })
  })
})
