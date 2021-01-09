import { useDbConnection } from "Utils/mongoTest"
import PcModel from ".."

import highestPhysical from "./highestPhysical"

describe('PcModel.highestPhysical', () => {
  useDbConnection("Pc_highestPhysical")
  
  it("works", () => {
    const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
    // highest physical attribute (either fort, agi or might, since they have the same value)
    const highestAttb1 = highestPhysical.get.call(pc1)
    expect(highestAttb1.bonus).toBe(0)
    expect(highestAttb1.value).toBe(0)
    expect(highestAttb1.name).toMatch(/Might|Agility|Fortitude/)
    
    const pc2 = PcModel.createCharacter({ name: "test", level: 1 })
    pc2.attributes.Might.value = 2
    pc2.attributes.Might.bonus = 4
    pc2.attributes.Agility.value = 1
    // highest physical attribute (either fort, agi or might, since they have the same value)
    const highestAttb2 = highestPhysical.get.call(pc2)
    expect(highestAttb2.bonus).toBe(4)
    expect(highestAttb2.value).toBe(2)
    expect(highestAttb2.name).toBe("Might")
  })
})
