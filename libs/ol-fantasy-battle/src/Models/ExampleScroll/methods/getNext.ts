import ScrollModel, { ScrollDocument } from ".."
import { ScrollInstanceMethod } from "../types"
import { isScroll } from "../helpers"

export interface getNext {
  (): Promise<ScrollDocument | null>,
}

export const getNextMethod: ScrollInstanceMethod<getNext> = async function(this) {
  // if no nextLevel
  if (!this.nextLevel) return Promise.resolve(null)
 
  // if populated document
  if (isScroll(this.nextLevel)) {
    return Promise.resolve(this.nextLevel)
  }

  // if unpopulated document
  return await ScrollModel.findOne({ _id: this.nextLevel })
}

export default getNextMethod
