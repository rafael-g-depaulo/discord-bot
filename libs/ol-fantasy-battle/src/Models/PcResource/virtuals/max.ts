import { ResourceVirtualGetter } from "../types"

const get: ResourceVirtualGetter<number> = function(this) {
  return this.base_max + this.bonus_max
}

export default { get }
