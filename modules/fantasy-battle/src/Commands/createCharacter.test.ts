import { mockMessage } from "@discord-bot/discord-mock"
import PcModel from "Models/PlayerCharacter"
import PlayerUserModel from "Models/PlayerUser"
import { mockDmMessage, mockPlayerMessage } from "Utils/mockMessage"

import { useDbConnection } from "Utils/Mongo/mongoTest"
import { test, execute } from "./createCharacter"

describe("Command: createCharacter", () => {
  useDbConnection("Command_createCharacter")

  describe(".test", () => {
    it("works", () => {
      expect("!create-char").toMatch(test)
      expect("!create-character").toMatch(test)
      expect("!createchar").toMatch(test)
      expect("!Create Character").toMatch(test)
      expect("!create     char").toMatch(test)
    })

    it("captures arguments", () => {
      expect("!create-char --name Test").toMatch(test)
      expect(test.exec("!create-char --name Test")?.groups).toMatchObject({ flags: "--name Test" })
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
      
      it(`doesn't allow a non-DM user to use command with --player flag`, async () => {
        const [message] = mockPlayerMessage()
        message.content = `!create-char --player "OtherPlayer" --name "Test"`
        
        await execute(message, test.exec(message.content)!)
        
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`only DM's can use this command with the --player flag`)
      })
    })

    describe("dealing with bad args", () => {
      it(`doesn't allow character without a name`, async () => {
        const [message] = mockPlayerMessage()
        message.content = `!create-char`

        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`\"**!create-char**\": --name flag is necessary. Please include it and try again`)
      })
      
      it(`doesn't allow repeated character names for same player`, async () => {
        const [message] = mockPlayerMessage()
        message.author.username = "Ragan"
        message.author.id = "6969"
        message.content = `!create-char --name "Allor"`

        // create player and their character
        const player = PlayerUserModel.createUser({ username: "Ragan", userId: "6969" })
        player.addCharacter(PcModel.createCharacter({ name: "Allor" }))
        await player.save()

        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`You already have a character named "Allor"! You can't repeat names, be more creative`)
      })

      it(`complains if --player doesn't exist`, async () => {
        const [message] = mockDmMessage()
        message.content = `!createChar --player "Ragan" --name "Kuff"`
        
        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`player "Ragan" doesn't exist in my database. are you sure you typed their name correctly?`)
      })

      it(`complains if bad --atk-attb`, async () => {
        const [message] = mockDmMessage()
        message.content = `!createChar --name "Kuff"   --atk-attb Maight`
        
        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`value "Maight" isn't a valid attribute name`)
      })
    })

    describe("happy paths", () => {
      it("works by default", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!create-char --name Horu`

        await execute(message, test.exec(message.content)!)

        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`Ok! Character "Horu" created for ${message.author.username}`)
      })
      
      it("works with --atk-attb", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!create-char --name "Kuff'Ssah" --atk-attb Fortitude`

        await execute(message, test.exec(message.content)!)

        const playerDoc = await PlayerUserModel.getUser(message.author.id)
        expect(playerDoc?.activeChar.name).toBe("Kuff'Ssah")
        expect(playerDoc?.activeChar.defaultAtkAttb).toBe("Fortitude")
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`Ok! Character "Kuff'Ssah" created for ${message.author.username}`)
      })

      it(`works with --player flag`, async () => {
        const [message] = mockDmMessage()
        message.content = `!create-char --name Horu --player "testPlayer"`

        const playerUser = PlayerUserModel.createUser({ username: "testPlayer", userId: "12345678922" })
        await playerUser.save()
        expect(playerUser?.characters.length).toBe(0)

        await execute(message, test.exec(message.content)!)

        const playerUser2 = await PlayerUserModel.getUser("12345678922")
        expect(playerUser2?.characters.length).toBe(1)
        expect(playerUser2?.characters[0].name).toBe("Horu")
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`Ok! Character "Horu" created for testPlayer`)})
    })
  })
})
