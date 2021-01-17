import { DefenseVirtualGetter } from "../types"

const get: DefenseVirtualGetter<number> = function(this) {
  return this.value + this.bonus
}

export default { get }
