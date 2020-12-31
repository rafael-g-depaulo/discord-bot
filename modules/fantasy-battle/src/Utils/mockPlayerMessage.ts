import { mockMember, mockMemberRoles, mockMessage } from "@discord-bot/discord-mock"

export default () => {
  const [ roles , { setRoles }] = mockMemberRoles()
  setRoles(["Player"])
  const [ member ] = mockMember({ roles })
  const [ message ] = mockMessage({ member })
  return message
}
