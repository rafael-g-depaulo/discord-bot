import { ScrollDocument } from "./types"

export const isScroll = (obj: ScrollDocument | any): obj is ScrollDocument => 
  obj && typeof obj.title === 'string' && typeof obj.author === 'string' 
