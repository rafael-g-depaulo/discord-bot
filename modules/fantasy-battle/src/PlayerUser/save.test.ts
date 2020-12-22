import PlayerUserModel, { PlayerUser } from "Models/PlayerUser"
import { useDbConnection } from "Utils/mongoTest"
import { PlayerUserState } from "./PlayerUser"
import { saveFactory } from "./save"

describe("PlayerCharacter.save()", () => {
  useDbConnection("PlayerUser_save")

  it('works', async () => {
    const modelProps: PlayerUser = { userId: "123456789", username: "test", characters: [] }
    const userState: PlayerUserState = {
      model: new PlayerUserModel(modelProps),
      characters: [],
      userId: "123",
      username: "test"
    }
    const save = saveFactory(userState)

    const saved1 = await save()
    expect(saved1.userId).toBe("123456789")

    await save()
    const saved2 = await PlayerUserModel.findById(userState.model._id)
    expect(saved2?.userId).toBe("123456789")
  })
})