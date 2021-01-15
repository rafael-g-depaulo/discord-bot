import { ScrollVirtualGetter } from "../types"

const get: ScrollVirtualGetter<string> = function(this) {
  return `${this.author}'s ${this.title}`
}

export default { get }
