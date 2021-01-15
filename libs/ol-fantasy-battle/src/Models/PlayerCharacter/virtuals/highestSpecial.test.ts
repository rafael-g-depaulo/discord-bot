import { useDbConnection } from "@discord-bot/mongo"
import PcModel from ".."

import highestSpecial from "./highestSpecial"

describe('PcModel.highestSpecial', () => {
  useDbConnection("Pc_highestSpecial")
  
  it("works", () => {
    const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
    // highest physical attribute (either fort, agi or might, since they have the same value)
    const highestAttb1 = highestSpecial.get.call(pc1)
    expect(highestAttb1.bonus).toBe(0)
    expect(highestAttb1.value).toBe(0)
    expect(highestAttb1.name).toMatch(/Alteration|Creation|Energy|Entropy|Influence|Movement|Prescience|Protection/)
    
    const pc2 = PcModel.createCharacter({ name: "test", level: 1 })
    pc2.attributes.Perception.value = 2
    pc2.attributes.Perception.bonus = 4
    pc2.attributes.Entropy.value = 1
    pc2.attributes.Entropy.bonus = 5
    pc2.attributes.Alteration.value = 0
    pc2.attributes.Alteration.bonus = 9
    // highest physical attribute (either fort, agi or might, since they have the same value)
    const highestAttb2 = highestSpecial.get.call(pc2)
    expect(highestAttb2.value).toBe(1)
    expect(highestAttb2.bonus).toBe(5)
    expect(highestAttb2.name).toBe("Entropy")
  })
})
