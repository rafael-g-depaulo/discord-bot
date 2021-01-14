import { mockMessage } from "@discord-bot/discord-mock"
import PcModel from "Models/PlayerCharacter"

import PlayerUserModel from "Models/PlayerUser"
import { mockDmMessage, mockPlayerMessage } from "Utils/Mock/mockMessage"
import { useDbConnection } from "Utils/Mongo/mongoTest"

import { test, execute } from "./changeResource"

describe("Command: changeResource", () => {
  useDbConnection("Command_changeResource")

  describe(".test", () => {
    it("works", () => {
      expect(`!hp -3`).toMatch(test)
      expect(`!hp -  1  `).toMatch(test)
      expect(`!vida +2`).toMatch(test)
      expect(`!mp +   5`).toMatch(test)
      expect(`!mana   + 5`).toMatch(test)

      expect(`!hp`).not.toMatch(test)
      expect(`!hp 5`).not.toMatch(test)
      expect(`!vida`).not.toMatch(test)
      expect(`!wrong`).not.toMatch(test)
    })
    it(`captures flags`, () => {
      expect(`!hp -3 --char Kuff`).toMatch(test)
      expect(test.exec(`!hp -3 --char Kuff`)?.groups).toMatchObject({ flags: "--char Kuff" })
    })
  })

  describe(".execute", () => {
    describe("permissions", () => {
      it(`doesn't allow a non-player, non-DM user to use command`, async () => {
        const [ message ] = mockMessage()
        message.content = `!mp +3`
        await execute(message, test.exec(message.content)!)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`sorry, but only people with the \"Player\" or \"Dm\" role can use this command`)
      })
      
      it(`doesn't allow a non-DM user to use command with --player flag`, async () => {
        const [message] = mockPlayerMessage()
        message.content = `!mp +3 --player "OtherPlayer"`
        await execute(message, test.exec(message.content)!)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`only DM's can use this command with the --player flag`)
      })
    })
    
    describe("dealing with bad args", () => {
      it(`complains if --char doesn't exist`, async () => {
        const [message] = mockPlayerMessage()
        message.content = `!hp -2 --char Kuff`
        await execute(message, test.exec(message.content)!)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`Player ${message.author.username} doesn't have a character that matches "Kuff". Try "!listChars" to see available characters`)
      })

      it(`complains if --player doesn't exist`, async () => {
        const [message] = mockDmMessage()
        message.content = `!hp -2 --player "Ragan" --char "Kuff"`
        await execute(message, test.exec(message.content)!)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(`player "Ragan" doesn't exist in my database. are you sure you typed their name correctly?`)
      })
    })

    describe("happy paths", () => {
      it("increases HP", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!vida + 2`

        const playerUser = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
        playerUser.addCharacter(PcModel.createCharacter({ name: "Horu" }))
        playerUser.activeChar.hp.current = 6
        await playerUser.save()
        await execute(message, test.exec(message.content)!)

        const fetchedUser = await PlayerUserModel.getUser(message.author.id)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(
          `**Horu**:` +
          `\nHP: 8/10 (+2)` +
          `\nMP: 10/10`
        )
        expect(fetchedUser?.activeChar.hp.current).toBe(8)
        expect(fetchedUser?.activeChar.mp.current).toBe(10)
      })
      it("decreases HP", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!vida - 12`

        const playerUser = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
        playerUser.addCharacter(PcModel.createCharacter({ name: "Horu" }))
        playerUser.activeChar.hp.current = 6
        await playerUser.save()
        await execute(message, test.exec(message.content)!)

        const fetchedUser = await PlayerUserModel.getUser(message.author.id)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(
          `**Horu**:` +
          `\nHP: -6/10 (-12)` +
          `\nMP: 10/10`
        )
        expect(fetchedUser?.activeChar.hp.current).toBe(-6)
        expect(fetchedUser?.activeChar.mp.current).toBe(10)
      })
      it("doesn't allow HP to rise above the max", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!vida +88`

        const playerUser = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
        playerUser.addCharacter(PcModel.createCharacter({ name: "Horu" }))
        playerUser.activeChar.hp.current = 6
        await playerUser.save()
        await execute(message, test.exec(message.content)!)

        const fetchedUser = await PlayerUserModel.getUser(message.author.id)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(
          `**Horu**:` +
          `\nHP: 10/10 (+88)` +
          `\nMP: 10/10`
        )
        expect(fetchedUser?.activeChar.hp.current).toBe(10)
        expect(fetchedUser?.activeChar.mp.current).toBe(10)
      })
      it("increases MP", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!ki + 3  `

        const playerUser = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
        playerUser.addCharacter(PcModel.createCharacter({ name: "Horu" }))
        playerUser.activeChar.mp.current = 6
        await playerUser.save()
        await execute(message, test.exec(message.content)!)

        const fetchedUser = await PlayerUserModel.getUser(message.author.id)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(
          `**Horu**:` +
          `\nHP: 10/10` +
          `\nMP: 9/10 (+3)`
        )
        expect(fetchedUser?.activeChar.hp.current).toBe(10)
        expect(fetchedUser?.activeChar.mp.current).toBe(9)
      })
      it("decreases MP", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!chakra -12`

        const playerUser = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
        playerUser.addCharacter(PcModel.createCharacter({ name: "Horu" }))
        playerUser.activeChar.mp.current = 4
        await playerUser.save()
        await execute(message, test.exec(message.content)!)

        const fetchedUser = await PlayerUserModel.getUser(message.author.id)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(
          `**Horu**:` +
          `\nHP: 10/10` +
          `\nMP: -8/10 (-12)`
        )
        expect(fetchedUser?.activeChar.hp.current).toBe(10)
        expect(fetchedUser?.activeChar.mp.current).toBe(-8)
      })
      it("doesn't allow MP to rise above the max", async () => {
        const [message] = mockPlayerMessage()
        message.content = `!mana + 88`

        const playerUser = PlayerUserModel.createUser({ userId: message.author.id, username: message.author.username })
        playerUser.addCharacter(PcModel.createCharacter({ name: "Horu" }))
        playerUser.activeChar.mp.current = 6
        await playerUser.save()
        await execute(message, test.exec(message.content)!)

        const fetchedUser = await PlayerUserModel.getUser(message.author.id)
        expect(message.channel.send).toBeCalledTimes(1)
        expect(message.channel.send).toBeCalledWith(
          `**Horu**:` +
          `\nHP: 10/10` +
          `\nMP: 10/10 (+88)`
        )
        expect(fetchedUser?.activeChar.hp.current).toBe(10)
        expect(fetchedUser?.activeChar.mp.current).toBe(10)
      })
    })
  })
})
