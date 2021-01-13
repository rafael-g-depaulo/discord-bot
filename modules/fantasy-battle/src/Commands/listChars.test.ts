import { mockMessage } from "@discord-bot/discord-mock"

import PcModel from "Models/PlayerCharacter"
import PlayerUserModel from "Models/PlayerUser"

import { mockPlayerMessage } from "Utils/mockMessage"
import { useDbConnection } from "Utils/mongoTest"

import { test, execute } from "./listChars"

describe("Command: listChars", () => {
  useDbConnection("Command_listChars")

  describe(".test", () => {
    it("works without args", () => {
      expect(`!listChars`).toMatch(test)
      expect(`!list-Chars`).toMatch(test)
      expect(`!list    Chars`).toMatch(test)
      expect(`!listCharacters`).toMatch(test)
      expect(`!list-Characters`).toMatch(test)
      expect(`!list   Characters`).toMatch(test)
    })
    it(`works with --player arg`, () => {
      expect(`!listChars  --player Jorge`).toMatch(test)
      expect(test.exec(`!listChars  --player Jorge`)?.groups).toMatchObject({ flags: "--player Jorge"})
      expect(`!list-Chars  --player=Jorge`).toMatch(test)
      expect(test.exec(`!list-Chars  --player=Jorge`)?.groups).toMatchObject({ flags: "--player=Jorge"})
      expect(`!list    Chars  --player "Jorge"`).toMatch(test)
      expect(test.exec(`!list    Chars  --player "Jorge"`)?.groups).toMatchObject({ flags: "--player \"Jorge\""})
    })
  })

  describe(".execute", () => {
    
    describe("bad paths", () => {
      describe("permissions", () => {
        it(`doesn't allow a non-player, non-DM user to use command`, async () => {
          const [ message ] = mockMessage()
          message.content = `!list-chars`
          
          await execute(message, test.exec(message.content)!)
          
          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(`sorry, but only people with the \"Player\" or \"Dm\" role can use this command`)
        })
      })

      describe("bad args", () => {
        it(`doesn't allow a --player flag with incorrect type`, async () => {
          const [msg1] = mockPlayerMessage()
          const [msg2] = mockPlayerMessage()
          msg1.content = `!list-chars --player`
          msg2.content = `!list-chars --player=5`
          
          await execute(msg1, test.exec(msg1.content)!)
          await execute(msg2, test.exec(msg1.content)!)
          
          expect(msg1.channel.send).toBeCalledTimes(1)
          expect(msg1.channel.send).toBeCalledWith(`\"**!list-chars**\": wrong type for flag --player. Flag expects type string, but received type boolean`)
          expect(msg2.channel.send).toBeCalledTimes(1)
          expect(msg2.channel.send).toBeCalledWith(`\"**!list-chars**\": wrong type for flag --player. Flag expects type string, but received type boolean`)
        })

        it(`doesn't allow a player user to use command with --player flag`, async () => {
          const [message] = mockPlayerMessage()
          message.content = `!list-chars --player "OtherPlayer"`
          
          await execute(message, test.exec(message.content)!)
          
          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(`only DM's can use this command with the --player flag`)
        })

        it(`complains if given player name doesn't exist`, async () => {
          const [message, mockMessageConfig] = mockMessage()
          mockMessageConfig.member.roles.setRoles(["DM"])
          message.content = `!list-chars --player "Ragan"`
          
          await execute(message, test.exec(message.content)!)

          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(`player "Ragan" doesn't exist in my database. are you sure you typed their name correctly?`)
        })
      })
    })
    
    describe("happy paths", () => {
      describe("player calling command without --player flag", () => {
        it(`returns empty if player doesn't have any characters`, async () => {
          const [message] = mockPlayerMessage()
          message.content = `!list-chars`
          await execute(message, test.exec(message.content)!)
          
          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(`you don't have any characters for me to list!`)
        })

        it(`returns the player's characters, if they exist`, async () => {
          const [message] = mockPlayerMessage()
          message.content = `!list-chars`

          const playerDoc = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
          playerDoc.addCharacter(PcModel.createCharacter({ name: "Horu" }))
          playerDoc.addCharacter(PcModel.createCharacter({ name: "Ssaak" }))
          playerDoc.activeCharIndex = 1
          await playerDoc.save()
          await execute(message, test.exec(message.content)!)
          
          const charListString = `Sure thing! Here are your characters:\n\n`
            + `\t1. Horu\n`
            + `\t2. Ssaak (active)`
          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(charListString)
        })
      })
      
      describe("DM calling command with --player flag", () => {
        it("returns empty if the player doesn't have any characters", async () => {
          const [message, mockMessageConfig] = mockMessage()
          mockMessageConfig.member.roles.setRoles(["DM"])
          message.content = `!list-chars --player "Ragan"`

          const playerDoc = PlayerUserModel.createUser({ username: "Ragan", userId: "420" })
          await playerDoc.save()

          await execute(message, test.exec(message.content)!)
          
          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(`Player "Ragan" doesn't have any characters for me to list`)
        })

        it("works for DM with --player flag", async () => {
          const [message, mockMessageConfig] = mockMessage()
          mockMessageConfig.member.roles.setRoles(["DM"])
          message.content = `!list-chars --player "Ragan"`

          const playerDoc = PlayerUserModel.createUser({ username: "Ragan", userId: "420" })
          playerDoc.addCharacter(PcModel.createCharacter({ name: "Horu" }))
          playerDoc.addCharacter(PcModel.createCharacter({ name: "Ssaak" }))
          await playerDoc.save()
          
          await execute(message, test.exec(message.content)!)
          
          const charListString = `Sure thing! Here are ${playerDoc.username}'s characters:\n\n`
            + `\t1. Horu (active)\n`
            + `\t2. Ssaak`
          expect(message.channel.send).toBeCalledTimes(1)
          expect(message.channel.send).toBeCalledWith(charListString)
        })
      })
    })
  })
})
