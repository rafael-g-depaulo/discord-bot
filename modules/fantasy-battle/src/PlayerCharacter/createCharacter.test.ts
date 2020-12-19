import { createCharacter, PlayerCharacterProps } from "./createCharacter"

describe('createCharacter', () => {
  
  it("passes static props", () => {
    const pcProps: PlayerCharacterProps = {
      name: "Ssaak",
    }

    const character = createCharacter(pcProps)

    expect(character.name).toBe("Ssaak")
  })
})
