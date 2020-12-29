import { Discord } from "@discord-bot/create-client"

import mockAuthor from "./Author"
import mockChannel from "./Channel"
import mockGuild from "./Guild"
import mockMember from "./Member"

import { DiscordPartial } from "./types"

interface messageMockConfig {
}
export type mockMessage = (props?: DiscordPartial<Discord.Message>) => [Discord.Message, messageMockConfig]
export const mockMessage: mockMessage = (props = {}) => { 
  const message = {
    // mock content
    content: "",
  
    // mock author
    author: mockAuthor()[0],
  
    // mock member
    member: mockMember()[0],
  
    // mock guild
    guild: mockGuild()[0],
  
    // mock channel
    channel: mockChannel()[0],
    
    // user-given mocks
    ...props,
  } as Discord.Message

  return [message, {}]
}

export default mockMessage
