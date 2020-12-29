import { Discord } from "@discord-bot/create-client"
import { DiscordPartial } from "./types"

interface authorMockConfig {
}
export type mockAuthor = (props?: DiscordPartial<Discord.User>) => [Discord.User, authorMockConfig]
export const mockAuthor: mockAuthor = (props = {}) => { 
  const author = {
    // default mock props
    id: "123456",
    username: "username",
    // user-given mocks
    ...props,
  } as Discord.User

  return [author, {}]
}

export default mockAuthor
