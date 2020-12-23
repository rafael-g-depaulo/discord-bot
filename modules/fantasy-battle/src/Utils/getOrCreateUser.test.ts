import { useDbConnection } from "Utils/mongoTest"
import logger from "Utils/logger"

import { createPlayerUser } from "PlayerUser"
import { createCharacter } from "PlayerCharacter"
import PlayerUserModel from "Models/PlayerUser"
import { getOrCreatePlayerUser } from "./getOrCreateUser"


describe("getOrCreatePlayerUser()", () => {
  
  useDbConnection("getOrCreatePlayerUser")

  it('works for retrieving an existing user', async () => {
    const createdUser1 = createPlayerUser({ userId: "123456789", username: "testUsername" })
    const createdUser2 = createPlayerUser({ userId: "987654321", username: "testUsername" })

    await createdUser1.addCharacter(createCharacter({ name: "testChar" }))
    createdUser1.characters[0].attributes.Agility.value = 3
    createdUser1.characters[0].attributes.Agility.bonus = -1
    await createdUser1.save()
    await createdUser2.save()

    const fetchedUser = await getOrCreatePlayerUser({ userId: "123456789", username: "testUsername" })
    
    expect(fetchedUser.userId).toBe("123456789")
    expect(fetchedUser.username).toBe("testUsername")
    expect(fetchedUser.characters.length).toBe(1)
    expect(fetchedUser.characters[0].name).toBe("testChar")
    expect(fetchedUser.characters[0].attributes.Agility.value).toBe(3)
    expect(fetchedUser.characters[0].attributes.Agility.bonus).toBe(-1)
    expect(fetchedUser.characters[0].attributes.Agility.total).toBe(2)

    const userCount = await PlayerUserModel.countDocuments()
    expect(userCount).toBe(2)
  })

  it('works for creation of an unexistent user', async () => {
    
    // 0 users at test start
    expect(await PlayerUserModel.countDocuments()).toBe(0)

    const createdUser = await getOrCreatePlayerUser({ userId: "123456789", username: "testUsername" })
    
    // 1 user at test end
    expect(createdUser.userId).toBe("123456789")
    expect(createdUser.username).toBe("testUsername")
    expect(createdUser.characters.length).toBe(0)
    expect(await PlayerUserModel.countDocuments()).toBe(1)
  })
})
