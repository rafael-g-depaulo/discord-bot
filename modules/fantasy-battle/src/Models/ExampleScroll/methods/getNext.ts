import ScrollModel, { ScrollDocument } from ".."
import { BaseScrollDocument } from "../types"
import { isScroll } from "../helpers"
import { Method } from "Models/helpers"

export interface getNext {
  (): Promise<ScrollDocument | null>,
}

const getNext: Method<BaseScrollDocument, getNext> = async function(this) {
  // if no nextLevel
  if (!this.nextLevel) return Promise.resolve(null)
 
  // if populated document
  if (isScroll(this.nextLevel)) {
    return Promise.resolve(this.nextLevel)
  }

  // if unpopulated document
  return await ScrollModel.findOne({ _id: this.nextLevel })
}

export default getNext
