import PcModel, { Pc } from "Models/PlayerCharacter"
import { useDbConnection } from "Utils/mongoTest"
import { Attribute } from "./Attribute"
import { PlayerCharacterProps, PlayerCharacterState } from "./createCharacter"
import { saveFactory } from "./save"

describe("PlayerCharacter.save()", () => {
  useDbConnection("PlayerCharacter_save")

  const mockState = (props: Pc): PlayerCharacterState => ({
    name: props.name,
    model: new PcModel(props),
    attributes: {
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
    }
  })

  it('works', async () => {
    const state = mockState({ name: "currentName" })
    const save = saveFactory(state)

    const saved1 = await save()
    expect(saved1.name).toBe("currentName")

    state.name = "new name"
    await save()
    const saved2 = await PcModel.findById(state.model._id)
    expect(saved2?.name).toBe("new name")
  })
})
