import { AttributeName, AttributeNames, PcDocument } from "./types"

export const isPC = (obj: PcDocument | any): obj is PcDocument => 
  obj && typeof obj.title === 'string' && typeof obj.author === 'string' 

export const isAttributeName = (str: string): str is AttributeName =>
  !!str && AttributeNames.includes(str as AttributeName)
