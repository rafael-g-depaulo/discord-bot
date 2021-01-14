import PcModel from "Models/PlayerCharacter"
import { useDbConnection } from "@discord-bot/mongo"
import ResourceModel from ".."

import createMp from "./createMp"

describe('PcResource.createMp()', () => {
  useDbConnection("PcResource_createMp")
  
  it("works", () => {
    const pc1 = PcModel.createCharacter({ name: "test", level: 1 })
    const mp1 = createMp.call(ResourceModel, pc1)
    expect(mp1.max).toBe(10)
    expect(mp1.base_max).toBe(10)
    expect(mp1.bonus_max).toBe(0)
    expect(mp1.current).toBe(10)

    const pc2 = PcModel.createCharacter({ name: "test", level: 1 })
    pc2.mpScaling.bonus = 3             // mp +3
    pc2.mpScaling.Persuasion = 2        
    pc2.attributes.Persuasion.value = 3 // mp +6
    pc2.level += 2                      // mp +4
    pc2.attributes.Logic.value = 2      // mp +3
    pc2.attributes.Entropy.value = 4    // mp +6
    const mp2 = createMp.call(ResourceModel, pc2)
    expect(mp2.max).toBe(32)
    expect(mp2.base_max).toBe(32)
    expect(mp2.bonus_max).toBe(0)
    expect(mp2.current).toBe(32)
  })
})
