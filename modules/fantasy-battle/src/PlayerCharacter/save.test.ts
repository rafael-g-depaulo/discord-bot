import PcModel, { Pc } from "Models/PlayerCharacter"
import { useDbConnection } from "Utils/mongoTest"

import { PlayerCharacterState } from "./PlayerCharacter"
import { Attribute } from "./Attribute"
import { saveFactory } from "./save"

describe("PlayerCharacter.save()", () => {
  useDbConnection("PlayerCharacter_save")

  const mockAttributes = () => ({
    Agility:    { value: 0, bonus: 0 } as Attribute,
    Alteration: { value: 0, bonus: 0 } as Attribute,
    Creation:   { value: 0, bonus: 0 } as Attribute,
    Deception:  { value: 0, bonus: 0 } as Attribute,
    Energy:     { value: 0, bonus: 0 } as Attribute,
    Entropy:    { value: 0, bonus: 0 } as Attribute,
    Fortitude:  { value: 0, bonus: 0 } as Attribute,
    Influence:  { value: 0, bonus: 0 } as Attribute,
    Learning:   { value: 0, bonus: 0 } as Attribute,
    Logic:      { value: 0, bonus: 0 } as Attribute,
    Might:      { value: 0, bonus: 0 } as Attribute,
    Movement:   { value: 0, bonus: 0 } as Attribute,
    Perception: { value: 0, bonus: 0 } as Attribute,
    Persuasion: { value: 0, bonus: 0 } as Attribute,
    Prescience: { value: 0, bonus: 0 } as Attribute,
    Presence:   { value: 0, bonus: 0 } as Attribute,
    Protection: { value: 0, bonus: 0 } as Attribute,
    Will:       { value: 0, bonus: 0 } as Attribute,
  })
  const mockState = (props: Omit<Pc, "attributes">): PlayerCharacterState => ({
    name: props.name,
    model: new PcModel({ attributes: mockAttributes(), ...props }),
    attributes: mockAttributes()
  })

  it(`saves the character's name`, async () => {
    const state = mockState({ name: "currentName" })
    const save = saveFactory(state)

    const saved1 = await save()
    expect(saved1.name).toBe("currentName")

    state.name = "new name"
    await save()
    const saved2 = await PcModel.findById(state.model._id)
    expect(saved2?.name).toBe("new name")
  })

  it(`saves the character's attributes`, async () => {
    const state = mockState({ name: "currentName" })
    state.attributes.Agility.value = 2
    state.attributes.Agility.bonus = 1

    const save = saveFactory(state)

    const saved1 = await save()
    expect(saved1.name).toBe("currentName")
    expect(saved1.attributes.Agility.value).toBe(2)
    expect(saved1.attributes.Agility.bonus).toBe(1)

    state.name = "new name"
    state.attributes.Agility.value = 3
    state.attributes.Agility.bonus = 2
    state.attributes.Might.value = 1
    state.attributes.Deception.bonus = 2

    await save()
    const saved2 = await PcModel.findById(state.model._id)
    expect(saved2?.name).toBe("new name")
    expect(saved2?.attributes.Agility.value).toBe(3)
    expect(saved2?.attributes.Agility.bonus).toBe(2)
    expect(saved2?.attributes.Might.value).toBe(1)
    expect(saved2?.attributes.Deception.bonus).toBe(2)
  })
})
