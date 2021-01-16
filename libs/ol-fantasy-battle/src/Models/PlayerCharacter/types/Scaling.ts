import { AttributeName } from "./Attribute"

export type Scaling = {
  // level scaling
  level: number,
  // base value
  base: number,
  // bonus value
  bonus: number,

  // highest attribute of a single kind
  highestPhysical: number,
  highestMental: number,
  highestSocial: number,
  highestSpecial: number,

// one entry for every attribute
} & { [key in AttributeName]: number }
