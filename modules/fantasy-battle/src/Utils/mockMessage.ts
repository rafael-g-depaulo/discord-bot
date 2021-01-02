import { mockMessage } from "@discord-bot/discord-mock"

export const mockPlayerMessage: mockMessage = () => {
  const [ message, messageMockConfig ] = mockMessage()
  messageMockConfig.member.roles.setRoles(["Player"])
  return [ message, messageMockConfig ]
}

export const mockDmMessage: mockMessage = () => {
  const [ message, messageMockConfig ] = mockMessage()
  messageMockConfig.member.roles.setRoles(["DM"])
  return [ message, messageMockConfig ]
}
