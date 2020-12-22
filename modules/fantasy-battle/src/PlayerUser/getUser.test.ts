import PlayerUserModel from "Models/PlayerUser"
import { useDbConnection } from "Utils/mongoTest"

import { createCharacter } from "PlayerCharacter"

import { getPlayerUserProps, getUser } from "./getUser"
import createUser, { createPlayerUserProps } from "./createUser"

describe("get PlayerUser", () => {
  
  useDbConnection("getPlayerUser")
  
  const createUserProps: createPlayerUserProps = {
    userId: "123456789",
    username: "test"
  }

  describe('dealing with bad props', () => {
    it(`throws when can't find an User with given id`, async () => {
      const userProps: getPlayerUserProps = {
        userId: "891274392533",
      }
      const getchedUser = await getUser(userProps)
      expect(getchedUser).toBe(null)
    })
  })

  describe("propeties", () => {
    it(`recieves direct props`, async () => {
      const userProps: getPlayerUserProps = {
        userId: createUserProps.userId,
      }
      const createdUser = createUser(createUserProps)
      await createdUser.save()

      const fetchedUser = await getUser(userProps)

      expect(fetchedUser?.userId).toBe(createUserProps.userId)
      expect(fetchedUser?.username).toBe(createUserProps.username)
    })

    describe(".characters", () => {
      it('works', async () => {
        const userProps: getPlayerUserProps = {
          userId: createUserProps.userId,
        }
        const createdUser = createUser(createUserProps)
        await createdUser.save()
        const fetchedUser = await getUser(userProps)
      
        expect(fetchedUser?.characters.length).toBe(0)

        const char = createCharacter({ name: "Horu" })
        await fetchedUser?.addCharacter(char)
        
        expect(fetchedUser?.characters.length).toBe(1)
        expect(fetchedUser?.characters[0].name).toBe("Horu")
      })
    })
  })

  describe(`methods`, () => {
    describe(`.addCharacter()`, () => {
      it('add it to the player instance', async () => {
        const userProps: getPlayerUserProps = {
          userId: createUserProps.userId,
        }
        const createdUser = createUser(createUserProps)
        await createdUser.save()
        const fetchedUser = await getUser(userProps)

        const char = createCharacter({ name: "Horu" })
        await fetchedUser?.addCharacter(char)
        
        expect(fetchedUser?.characters.length).toBe(1)
        expect(fetchedUser?.characters[0].name).toBe("Horu")
      })

      it('adds it to the player model and saves', async () => {
        const userProps: getPlayerUserProps = {
          userId: createUserProps.userId,
        }
        const createdUser = createUser(createUserProps)
        await createdUser.save()
        const fetchedUser = await getUser(userProps)

        const char = createCharacter({ name: "Horu" })
        await fetchedUser?.addCharacter(char)
        
        const savedUser = await PlayerUserModel.findById(fetchedUser?.model._id)
        expect(savedUser?.characters.length).toBe(1)
        expect(savedUser?.characters[0].name).toBe("Horu")
      })
    })
  })
})
