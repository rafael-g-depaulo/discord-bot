import { Attribute, Pc } from "../PlayerCharacter/types"
import { Resource } from "./types"

export const mockResource = (): Resource => ({
  base_max: 0,
  bonus_max: 0,
  current: 0,
  temporary: 0,
})

export const getMaxHp = ({}: Pc): number => {
  return 0
}

export const getMaxMp = ({}: Pc): number => {
  return 0
}
