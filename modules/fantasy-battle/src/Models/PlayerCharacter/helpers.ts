import { PcDocument } from "./types"

export const isPC = (obj: PcDocument | any): obj is PcDocument => 
  obj && typeof obj.title === 'string' && typeof obj.author === 'string' 
