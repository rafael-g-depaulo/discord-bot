import { mockAuthor, mockMember, mockMemberRoles, mockMessage } from "@discord-bot/discord-mock"
import PcModel from "Models/PlayerCharacter"
import PlayerUserModel from "Models/PlayerUser"
import mockPlayerMessage from "Utils/mockPlayerMessage"

import { useDbConnection } from "Utils/mongoTest"
import { test, execute } from "./createCharacter"

describe("Command: createCharacter", () => {
  useDbConnection("Command_createCharacter")

  describe(".test", () => {
    it("works", () => {
      expect("!create-char").toMatch(test)
      expect("!create-char").toMatch(test)
      expect("!createchar").toMatch(test)
      expect("!CreateChar").toMatch(test)
      expect("!create     char").toMatch(test)
    })
  })

  describe(".execute", () => {
    
    describe("permissions", () => {
      it(`doesn't allow a non-player, non-DM user to use command`, async () => {
        const [ message ] = mockMessage()
        message.content = `!create-char`

        await execute(message, test.exec(message.content)!)
        
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`sorry, but only people with the \"Player\" or \"Dm\" role can use this command`)
      })
    })

    describe("dealing with bad args", () => {
      it(`doesn't allow character without a name`, async () => {
        const message = mockPlayerMessage()
        message.content = `!create-char`

        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`!create-char command needs argument --name="characterNameHere" or --name characterName`)
      })
      
      it(`doesn't allow repeated character names for same player`, async () => {
        // mock author, user-roles and message
        const [ roles , { setRoles }] = mockMemberRoles()
        setRoles(["Player"])
        const [ member ] = mockMember({ roles })
        const [ author ] = mockAuthor({ username: "Ragan", id: "6969" })
        const [ message ] = mockMessage({ member, author })
        message.content = `!create-char --name "Allor"`

        // create player and their character
        const player = PlayerUserModel.createUser({ username: "Ragan", userId: "6969" })
        player.addCharacter(PcModel.createCharacter({ name: "Allor" }))
        await player.save()

        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`You already have a character named "Allor"! You can't repeat names, be more creative`)
      })
    })

    describe("happy paths", () => {
      it("works", async () => {
        const message = mockPlayerMessage()
        message.content = `!create-char --name Horu`

        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`Ok! Character "Horu" created for ${message.author.username}`)
      })
    })
  })
})
