import PlayerUserModel from "Models/PlayerUser"
import PcModel from "Models/PlayerCharacter"

import addCharacter from "./addCharacter"

describe(".addCharacter()", () => {
  const mockUser = () => PlayerUserModel.createUser({ userId: "123456789", username: "usernameTest" })

  it('allows adding a new character', async () => {
    const user = mockUser()

    // add character
    addCharacter.call(user, PcModel.createCharacter({ name: "Allor" }))
    
    // check that the character was added to user
    expect(user.characters.length).toBe(1)
    expect(user.characters[0].name).toBe("Allor")
  })
})
