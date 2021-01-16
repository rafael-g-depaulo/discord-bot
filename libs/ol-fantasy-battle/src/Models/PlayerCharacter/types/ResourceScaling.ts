import { AttributeName } from "./Attribute"

// type that determines the scaling for a resource (hp/mp)
export type ResourceScaling = {
  // level scaling
  level: number,
  // base hp/mp
  base: number,
  // bonus hp/mp
  bonus: number,

  // highest attribute of a single kind
  highestPhysical: number,
  highestMental: number,
  highestSocial: number,
  highestSpecial: number,

// one entry for every attribute
} & { [key in AttributeName]: number }
