export interface Attribute {
  value: number,
  bonus: number,
}
export type Attributes = {
  [key in AttributeNames]: Attribute
}

export type AttributeNames =
  "Agility"    | "Fortitude"  | "Might"      | "Learning"  |
  "Logic"      | "Perception" | "Will"       | "Deception" |
  "Persuasion" | "Presence"   | "Alteration" | "Creation"  |
  "Energy"     | "Entropy"    | "Influence"  | "Movement"  |
  "Prescience" | "Protection"

export const AttributeNames: AttributeNames[] = [
  "Agility"    , "Fortitude"  , "Might"      , "Learning"  ,
  "Logic"      , "Perception" , "Will"       , "Deception" ,
  "Persuasion" , "Presence"   , "Alteration" , "Creation"  ,
  "Energy"     , "Entropy"    , "Influence"  , "Movement"  ,
  "Prescience" , "Protection" ,
]

export const createAttribute = (): Attribute => ({
  value: 0,
  bonus: 0,
})

export const createAttributes = (): Attributes => Object
  .fromEntries(AttributeNames
    .map(attName => [attName, createAttribute()])
  ) as Attributes
