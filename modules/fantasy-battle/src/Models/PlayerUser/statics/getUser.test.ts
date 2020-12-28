import { useDbConnection } from "Utils/mongoTest"
import PlayerUserModel from ".."
import { PlayerUser } from "../types"
import getUser from "./getUser"

describe(".getUser()", () => {
  
  useDbConnection("PlayerUser_getUser")

  const userInfo: PlayerUser = {
    userId: "1234567890",
    username: "test",
    characters: []
  }

  it("works when given a correct userId", async () => {
    const user = new PlayerUserModel(userInfo)
    const userSaved = await user.save()

    const fetchedUser = await getUser.call(PlayerUserModel, userInfo.userId)

    expect(fetchedUser?.userId).toBe(userSaved.userId)
    expect(fetchedUser?.userId).toBe(userInfo.userId)
  })

  it('returns null when given an incorrect userId', async () => {
    const fetchedUser = await PlayerUserModel.getUser(userInfo.userId)
    expect(fetchedUser).toBe(null)
  })
})
