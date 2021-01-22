import { Discord } from "@discord-bot/create-client"

import mockAuthor, { authorMockConfig } from "./Author"
import mockChannel, { channelMockConfig } from "./Channel"
import mockGuild, { guildMockConfig } from "./Guild"
import mockMember, { memberMockConfig } from "./Member"

import { DiscordPartial } from "./types"

export interface messageMockConfig {
  author: authorMockConfig,
  channel: channelMockConfig,
  guild: guildMockConfig,
  member: memberMockConfig,
}
export type mockMessage = (props?: DiscordPartial<Discord.Message>) => [Discord.Message, messageMockConfig]
export const mockMessage: mockMessage = (props = {}) => {

  const [ author, authorMockConfig ] = mockAuthor()
  const [ member, memberMockConfig ] = mockMember()
  const [ channel, channelMockConfig ] = mockChannel()
  const [ guild, guildMockConfig ] = mockGuild()

  const message = {
    // mock content
    content: "",

    // mock other important stuff
    author,
    member,
    guild,
    channel,
    attachments: new Discord.Collection<string, Discord.MessageAttachment>(),
    
    // user-given mocks
    ...props,
  } as Discord.Message

  const messageMockConfig: messageMockConfig = {
    author: authorMockConfig,
    channel: channelMockConfig,
    guild: guildMockConfig,
    member: memberMockConfig,
  }
  return [message, messageMockConfig]
}

export default mockMessage
