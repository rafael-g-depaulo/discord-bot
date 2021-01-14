import mockAttributes from "Utils/Mock/mockAttributes"
import { useDbConnection } from "Utils/Mongo/mongoTest"
import PcModel, { Pc } from "Models/PlayerCharacter"
import PlayerUserModel, { PlayerUser } from "./index"
import { createPlayerUserProps } from "./statics/create"

describe("PlayerUser Model", () => {

  useDbConnection("PlayerUser")

  const userInfo: PlayerUser = {
    userId: "1234567890",
    username: "test",
    characters: []
  }
  describe("CRUD", () => {
    it("creates", async () => {
      const user = new PlayerUserModel(userInfo)
      const userSaved = await user.save()
      expect(user.userId).toStrictEqual(userSaved?.userId)
      expect(user._id).toStrictEqual(userSaved?._id)
      expect(userInfo.userId).toStrictEqual(userSaved?.userId)
    })

    it("reads", async () => {
      const user = new PlayerUserModel(userInfo)
      await user.save()

      const readPlayerUser = await PlayerUserModel.findById(user._id)
      expect(user._id).toStrictEqual(readPlayerUser?._id)
    })
    
    it("updates", async () => {
      const user = new PlayerUserModel(userInfo)
      await user.save()

      const read1 = await PlayerUserModel.findById(user._id)
      user.userId = "69696969"
      await user.save()

      const read2 = await PlayerUserModel.findById(user._id)
      expect(read1?.userId).toEqual("1234567890")
      expect(read2?.userId).toEqual("69696969")
    })
    
    it("deletes", async () => {
      const user = new PlayerUserModel(userInfo)
      await user.save()

      const read = await PlayerUserModel.findById(user._id)
      expect(read).not.toBe(null)

      await user.delete()
      const deleted = await PlayerUserModel.findById(user._id)
      expect(deleted).toBe(null)
    })
  })

  describe("relation: characters", () => {
    it('works', async () => {
      // create user
      const user = new PlayerUserModel(userInfo)
      
      // create character
      const charProps: Pc = {
        name: "test char",
        attributes: mockAttributes(),
      }
      const character = new PcModel(charProps)

      // add character to user's characters
      user.characters.push(character)
      
      // save user
      await user.save()

      // retrieve user
      const savedUser = await PlayerUserModel.findOne({ _id: user._id })

      // check that character is saved as part of user schema (as a sub-document)
      expect(savedUser?.characters[0]._id).toEqual(character._id)
      expect(savedUser?.characters[0].name).toEqual(character.name)
    })
  })

  describe("statics", () => {
    describe('.createUser()', () => {
      it('throws if bad props', () => {
        expect(() => PlayerUserModel.createUser({} as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): username prop missing or empty`)
        expect(() => PlayerUserModel.createUser({ username: true } as unknown as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): username prop missing or empty`)
        expect(() => PlayerUserModel.createUser({ username: "" } as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): username prop missing or empty`)
        expect(() => PlayerUserModel.createUser({ username: "asd", userId: {} } as unknown as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): userId prop missing or empty`)
        expect(() => PlayerUserModel.createUser({ username: "asd", userId: "" } as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): userId prop missing or empty`)
      })

      it('allows creating a new user', async () => {
        const user = PlayerUserModel.createUser({ userId: "420", username: "testUsername" })        
        // check that the character was added to user
        expect(user.username).toBe("testUsername")
        expect(user.userId).toBe("420")
        expect(user.characters.length).toBe(0)
      })
    })

    describe(".getUser()", () => {
      it("works when given a correct userId", async () => {
        const user = new PlayerUserModel(userInfo)
        const userSaved = await user.save()

        const fetchedUser = await PlayerUserModel.getUser(userInfo.userId)

        expect(fetchedUser?.userId).toBe(userSaved.userId)
        expect(fetchedUser?.userId).toBe(userInfo.userId)
      })

      it('returns null when given an incorrect userId', async () => {
        const fetchedUser = await PlayerUserModel.getUser(userInfo.userId)
        expect(fetchedUser).toBe(null)
      })
    })
    

    describe(".getOrCreate()", () => {
      it("retrieves an existing user", async () => {
        const createdUser = PlayerUserModel.createUser(userInfo)
        await createdUser.save()

        const fetchedUser = await PlayerUserModel.getOrCreate(userInfo)
        
        expect(fetchedUser.userId).toBe(userInfo.userId)
        expect(fetchedUser.username).toBe(userInfo.username)
        expect(await PlayerUserModel.countDocuments()).toBe(1)
      })

      it('creates a new user', async () => {
        expect(await PlayerUserModel.countDocuments()).toBe(0)
        const fetchedUser = await PlayerUserModel.getOrCreate(userInfo)

        expect(fetchedUser.userId).toBe(userInfo.userId)
        expect(fetchedUser.username).toBe(userInfo.username)
        expect(await PlayerUserModel.countDocuments()).toBe(1)
      })
    })
  })

  describe("methods", () => {
    describe(".addCharacter()", () => {
      it("works", () => {
        const user = PlayerUserModel.createUser({ username: "userTest", userId: "420" })
        expect(user.characters.length).toBe(0)
        user.addCharacter(PcModel.createCharacter({ name: "Allor" }))
        expect(user.characters.length).toBe(1)
        expect(user.characters[0]).toMatchObject({ name: "Allor" })
      })
    })

    describe(".removeCharacter()", () => {
      it('allows removing a character', async () => {
        const user = PlayerUserModel.createUser({ username: "userTest", userId: "420" })
        // add character
        const allor = PcModel.createCharacter({ name: "Allor" })
        user.addCharacter(allor)
        
        // check that the character was removed from user
        expect(user.characters[0].name).toBe("Allor")
        expect(user.characters.length).toBe(1)
        expect(user.activeCharIndex).toBe(0)

        // remove character
        user.removeCharacter(allor)
        // check that the character was removed from user
        expect(user.characters.length).toBe(0)
        expect(user.activeCharIndex).toBe(undefined)
      })

      it('resets the characterIndex', () => {
        const user = PlayerUserModel.createUser({ username: "userTest", userId: "420" })
        // add character
        const allor = PcModel.createCharacter({ name: "Allor" })
        const horu = PcModel.createCharacter({ name: "Horu" })
        user.addCharacter(allor)
        user.addCharacter(horu)
        
        // check that the character was removed from user
        expect(user.characters.length).toBe(2)
        expect(user.characters[0].name).toBe("Allor")
        expect(user.characters[1].name).toBe("Horu")
        expect(user.activeCharIndex).toBe(0)

        // remove character
        user.removeCharacter(allor)
        // check that the character was removed from user
        expect(user.characters.length).toBe(1)
        expect(user.activeCharIndex).toBe(0)

        // remove character
        user.removeCharacter(horu)
        // check that the character was removed from user
        expect(user.characters.length).toBe(0)
        expect(user.activeCharIndex).toBe(undefined)
      })
    })

    describe(".getCharacter()", () => {  
      it('allows getting a character by fullname', async () => {
        const user = PlayerUserModel.createUser({ userId: "123456789", username: "usernameTest" })
        // add character
        user.addCharacter(PcModel.createCharacter({ name: "Allor Aglon" }))
        const allor = user.getCharacter("Allor Aglon")
        // check that the character was added to user
        expect(allor?.name).toBe("Allor Aglon")
      })
      
      it(`doesn't care about CaSe`, async () => {
        const user = PlayerUserModel.createUser({ userId: "123456789", username: "usernameTest" })
        // add character
        user.addCharacter(PcModel.createCharacter({ name: "Allor Aglon" }))
        const allor = user.getCharacter("ALLOR aglon")
        // check that the character was added to user
        expect(allor?.name).toBe("Allor Aglon")
      })
      
      it(`works with substrings of the full name`, async () => {
        const user = PlayerUserModel.createUser({ userId: "123456789", username: "usernameTest" })
        // add character
        user.addCharacter(PcModel.createCharacter({ name: "Allor Aglon" }))
        const allor1 = user.getCharacter("allor")
        const allor2 = user.getCharacter("aglon")
        // check that the character was added to user
        expect(allor1?.name).toBe("Allor Aglon")
        expect(allor2?.name).toBe("Allor Aglon")
      })
    })
  })
})
