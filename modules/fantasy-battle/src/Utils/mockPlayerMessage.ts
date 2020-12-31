import { mockMessage } from "@discord-bot/discord-mock"

export default () => {
  const [ message, messageMockConfig ] = mockMessage()
  messageMockConfig.member.roles.setRoles(["Player"])
  return message
}
