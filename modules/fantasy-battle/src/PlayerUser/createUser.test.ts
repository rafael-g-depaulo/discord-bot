import { useDbConnection } from "Utils/mongoTest"
import PlayerUserModel from "Models/PlayerUser"
import { createCharacter } from "PlayerCharacter"

import { createPlayerUserProps, createUser } from "./createUser"

describe("PlayerUser", () => {
  
  useDbConnection("createPlayerUser")

  describe('dealing with bad props', () => {
    it(`throws when props are wrong type`, () => {
      const incompleteProps = {
        userId: "sdfsdf",
      } as createPlayerUserProps
      const nullProps = {
        userId: "sdfsdf",
        username: null,
      } as unknown as createPlayerUserProps
      const wrongTypeProps = {
        userId: 64,
        username: true,
      } as unknown as createPlayerUserProps

      expect(() => createUser(incompleteProps)).toThrowError(`PlayerUser.createUser(): Invalid props for createUser`)
      expect(() => createUser(nullProps)).toThrowError(`PlayerUser.createUser(): Invalid props for createUser`)
      expect(() => createUser(wrongTypeProps)).toThrowError(`PlayerUser.createUser(): Invalid props for createUser`)
    })
  })

  describe("propeties", () => {
    it(`passes direct props`, () => {
      const userProps: createPlayerUserProps = {
        userId: "891274392533",
        username: "test",
      }
      const user = createUser(userProps)

      expect(user.userId).toBe(userProps.userId)
      expect(user.username).toBe(userProps.username)
    })

    describe(".characters", () => {
      it('works', async () => {
        const userProps: createPlayerUserProps = {
          userId: "891274392533",
          username: "test",
        }
      
        const user = createUser(userProps)
        expect(user.characters.length).toBe(0)
        
        const char = createCharacter({ name: "Horu" })
        await user.addCharacter(char)
        
        expect(user.characters.length).toBe(1)
        expect(user.characters[0].name).toBe("Horu")
      })
    })
  })

  describe(`methods`, () => {
    describe(`.addCharacter()`, () => {
      it('add it to the player instance', async () => {
        const userProps: createPlayerUserProps = {
          userId: "891274392533",
          username: "test",
        }
        const user = createUser(userProps)

        const char = createCharacter({ name: "Horu" })
        await user.addCharacter(char)
        
        expect(user.characters.length).toBe(1)
        expect(user.characters[0].name).toBe("Horu")
      })

      it('adds it to the player model and saves', async () => {
        const userProps: createPlayerUserProps = {
          userId: "891274392533",
          username: "test",
        }
        const user = createUser(userProps)

        const char = createCharacter({ name: "Horu" })
        await user.addCharacter(char)
        
        const savedUser = await PlayerUserModel.findById(user.model._id)
        expect(savedUser?.characters.length).toBe(1)
        expect(savedUser?.characters[0].name).toBe("Horu")
      })
    })
  })
})
