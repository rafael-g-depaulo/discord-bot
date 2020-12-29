import { Discord } from "@discord-bot/create-client"
import { DiscordPartial } from "./types"

interface channelMockConfig {
}
export type mockChannel = (props?: DiscordPartial<Discord.TextChannel>) => [Discord.TextChannel, channelMockConfig]
export const mockChannel: mockChannel = (props = {}) => { 
  const author = {
    send: jest.fn(),
    // user-given mocks
    ...props,
  } as Discord.TextChannel

  return [author, {}]
}

export default mockChannel
