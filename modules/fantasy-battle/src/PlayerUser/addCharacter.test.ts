import PcModel from "Models/PlayerCharacter"
import PlayerUserModel, { PlayerUser as PlayerUserDocProps } from "Models/PlayerUser"
import logger from "Utils/logger"
import { useDbConnection } from "Utils/mongoTest"
import { createCharacter } from "../PlayerCharacter"
import { addCharacterFactory } from "./addCharacter"
import { PlayerUserProps, PlayerUserState } from "./createUser"

describe(".addCharacter()", () => {
  useDbConnection("PlayerUser_addCharacter")

  it('allows adding a new character', async () => {

    const modelProps: PlayerUserDocProps = {
      userId: "123456789",
      characters: [],
    }
    const userState: PlayerUserState = {
      characters: [],
      model: new PlayerUserModel(modelProps)
    }
    const addCharacter = addCharacterFactory(userState, userState.model.save)
    
    // add character
    await addCharacter(createCharacter({ name: "Allor" }))
    
    // check that the character was added to user
    expect(userState.characters.length).toBe(1)
    expect(userState.characters[0].name).toBe("Allor")

    // check that the document was updated in the bd (both the userModel and the char model)
    const userModel = await PlayerUserModel.findById(userState.model._id)
    const charModel = await PcModel.findById(userState.characters[0].model._id)
    expect(userModel?.characters.length).toBe(1)
    expect(userModel?.characters[0].name).toBe("Allor")
    expect(charModel?.name).toBe("Allor")
  })
})
