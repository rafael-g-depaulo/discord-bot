import { useDbConnection } from "Utils/Mongo/mongoTest"

import create, { createPlayerUserProps } from "./create"
import PlayerUserModel from ".."

describe('PlayerCharacter.createCharacter()', () => {
  useDbConnection("PlayerCharacter_createCharacter")
  
  describe('dealing with bad props', () => {
    it('throws if no name given or "" given', () => {
      expect(() => create.call(PlayerUserModel, {} as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): username prop missing or empty`)
      expect(() => create.call(PlayerUserModel, { username: true } as unknown as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): username prop missing or empty`)
      expect(() => create.call(PlayerUserModel, { username: "" } as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): username prop missing or empty`)
      expect(() => create.call(PlayerUserModel, { username: "asd", userId: {} } as unknown as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): userId prop missing or empty`)
      expect(() => create.call(PlayerUserModel, { username: "asd", userId: "" } as createPlayerUserProps)).toThrowError(`Fantasy Battle: createCharacter(): userId prop missing or empty`)
    })
  })

  describe(`properties`, () => {
    it(`passes direct props`, () => {
      const userProps: createPlayerUserProps = {
        username: "userTest",
        userId: "123456",
      }
      const user = create.call(PlayerUserModel, userProps)
      expect(user.username).toBe("userTest")
      expect(user.userId).toBe("123456")
      expect(user.characters.length).toBe(0)
    })
  })
})
