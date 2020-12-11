import { Client, ClientEvents, Message } from "discord.js"

export type DiscordOn = <K extends keyof ClientEvents>(event: K, listener: (...args: ClientEvents[K]) => void) => Client

// mock discord client
export type MockedClient = Partial<Record<keyof Client, any>>
export const mockDiscordClient = (clientMock?: MockedClient) => {
  return {
    on: jest.fn() as DiscordOn,
    ...clientMock,
  } as Client
}

export type DiscordEvent = keyof ClientEvents

// mock discord message object
export type MockedMessage = Partial<Record<keyof Message, any>>
export const mockDiscordMessage = (clientMock?: MockedMessage) => {
  return {
    content: "",
    author: { bot: false },
    ...clientMock,
  } as Message
}

// mock client with only on.message
// whenever an event listener is added, it is immediately called with
// a mocked message with the given string as content
export const mockClientWithMessage = (content: string) => {
  let callbacks: ((msg: Message) => void)[] = []

  return mockDiscordClient({
    on: jest.fn<void, [DiscordEvent, (msg: Message) => void]>(
      (_, callback) => {
        const message = mockDiscordMessage({ content })
        callbacks.push(callback)
        callback(message)
      }
    ),
    removeListener: jest.fn(
      (_, callback) => {
        callbacks = callbacks.filter(c => c !== callback)
      }
    ),
  })
}

export default mockDiscordClient
