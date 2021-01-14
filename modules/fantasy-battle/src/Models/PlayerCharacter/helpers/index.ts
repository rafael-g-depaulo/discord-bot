import { AttributeName, AttributeNames, PcDocument } from "../types"

export const isPC = (obj: PcDocument | any): obj is PcDocument => 
  obj && typeof obj.title === 'string' && typeof obj.author === 'string' 

export const isAttributeName = (str?: any): str is AttributeName =>
  !!str && typeof str === "string" && AttributeNames.includes(str as AttributeName)

export { alternateAttributeNames } from "./attributes"

export * from "./dmgDice"
