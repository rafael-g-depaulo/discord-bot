import { PlayerUserDocument } from "."

export const isPlayerUser = (obj: PlayerUserDocument | any): obj is PlayerUserDocument => 
  obj && typeof obj.userId === 'string' && Array.isArray(obj.characters)
