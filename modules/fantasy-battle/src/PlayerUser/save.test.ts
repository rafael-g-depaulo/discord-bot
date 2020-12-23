import PlayerUserModel, { PlayerUser } from "Models/PlayerUser"
import { createCharacter } from "PlayerCharacter"
import { Attribute } from "PlayerCharacter/Attribute"
import { PlayerCharacterState } from "PlayerCharacter/PlayerCharacter"
import { useDbConnection } from "Utils/mongoTest"
import { PlayerUserState } from "./PlayerUser"
import { saveFactory } from "./save"

describe("PlayerCharacter.save()", () => {
  useDbConnection("PlayerUser_save")

  const mockState = (props: Partial<PlayerUser>): PlayerUserState => ({
    userId: props.userId ?? "123456789",
    username: props.username ?? "test",
    characters: [],
    model: new PlayerUserModel({ userId: props.userId, username: props.username })
  })
  it(`saves the user's username`, async () => {
    const userState = mockState({ userId: "123456789", username: "test" })
    const save = saveFactory(userState)

    // model returned by save method
    const saved1 = await save()
    expect(saved1.userId).toBe("123456789")
    expect(saved1.username).toBe("test")

    // model retrieved by find (make sure it actually saved to db)
    const saved2 = await PlayerUserModel.findById(userState.model._id)
    expect(saved2?.userId).toBe("123456789")
    expect(saved2?.username).toBe("test")
  })
  
  it(`saves the user's characters`, async () => {
    const userState = mockState({ userId: "123456789", username: "test" })
    userState.characters.push(createCharacter({ name: "Ssaak" }))
    userState.characters[0].attributes.Energy.value = 5
    userState.characters[0].attributes.Energy.bonus = -3

    const save = saveFactory(userState)
    
    // model returned by save method
    const saved1 = await save()
    expect(saved1.characters.length).toBe(1)
    expect(saved1.characters[0].name).toBe("Ssaak")
    expect(saved1.characters[0].attributes.Energy.value).toBe(5)
    expect(saved1.characters[0].attributes.Energy.bonus).toBe(-3)

    // model retrieved by find (make sure it actually saved to db)
    const saved2 = await PlayerUserModel.findById(userState.model._id)
    expect(saved2?.characters.length).toBe(1)
    expect(saved2?.characters[0].name).toBe("Ssaak")
    expect(saved2?.characters[0].attributes.Energy.value).toBe(5)
    expect(saved2?.characters[0].attributes.Energy.bonus).toBe(-3)
  })
})
