import { useDbConnection } from "Utils/mongoTest"
import PcModel from ".."

import highestSocial from "./highestSocial"

describe('PcModel.highestSocial', () => {
  useDbConnection("Pc_highestSocial")
  
  it("works", () => {
    const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
    // highest physical attribute (either fort, agi or might, since they have the same value)
    const highestAttb1 = highestSocial.get.call(pc1)
    expect(highestAttb1.bonus).toBe(0)
    expect(highestAttb1.value).toBe(0)
    expect(highestAttb1.name).toMatch(/Deception|Persuasion|Presence/)
    
    const pc2 = PcModel.createCharacter({ name: "test", level: 1 })
    pc2.attributes.Perception.value = 2
    pc2.attributes.Perception.bonus = 4
    pc2.attributes.Persuasion.value = 1
    pc2.attributes.Persuasion.bonus = 5
    pc2.attributes.Presence.value = 0
    pc2.attributes.Presence.bonus = 9
    // highest physical attribute (either fort, agi or might, since they have the same value)
    const highestAttb2 = highestSocial.get.call(pc2)
    expect(highestAttb2.value).toBe(1)
    expect(highestAttb2.bonus).toBe(5)
    expect(highestAttb2.name).toBe("Persuasion")
  })
})
