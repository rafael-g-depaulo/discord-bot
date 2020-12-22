import PcModel, { Pc } from "Models/PlayerCharacter"
import { PlayerCharacter } from "PlayerCharacter"
import logger from "Utils/logger"
import { useDbConnection } from "Utils/mongoTest"
import PlayerUserModel, { PlayerUser } from "./index"

describe("PlayerUser Model", () => {

  useDbConnection("PlayerUser")

  const userInfo: PlayerUser = {
    userId: "1234567890",
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
        name: "test char"
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
  })
})
