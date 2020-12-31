import { mockMessage } from "@discord-bot/discord-mock"

const mockPlayerMessage: mockMessage = () => {
  const [ message, messageMockConfig ] = mockMessage()
  messageMockConfig.member.roles.setRoles(["Player"])
  return [ message, messageMockConfig ]
}

export default mockPlayerMessage
