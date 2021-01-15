import { ScrollDocument } from ".."
import { ScrollStaticMethod } from "../types"

export interface getByAuthor {
  (author: string): Promise<ScrollDocument[]>,
}

const getByAuthor: ScrollStaticMethod<getByAuthor> = async function(this, author) {
  return await this.find({ author })
}

export default getByAuthor
