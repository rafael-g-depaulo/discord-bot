import { createPlayerUser } from "PlayerUser"
import { PlayerUser, PlayerUserProps } from "./createUser"

describe("PlayerUser", () => {
  
  describe('dealing with bad props', () => {})

  describe("propeties", () => {
    it(`passes direct props`, () => {
      const userProps: PlayerUserProps = {
        userId: "891274392533",
        username: "",
      }
      const user = createPlayerUser(userProps)

      expect(user.userId).toBe(userProps.userId)
      expect(user.username).toBe(userProps.username)
    })
  })
})
