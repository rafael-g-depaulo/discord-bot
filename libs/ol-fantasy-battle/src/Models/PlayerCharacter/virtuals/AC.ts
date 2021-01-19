import { PcVirtualGetter } from "../types"

const get: PcVirtualGetter<number> = function(this) {
  const dodgeValue = this.dodge.total
  return 8 + dodgeValue
}

export default { get }
