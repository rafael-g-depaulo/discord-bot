import { AttributeName, HighestAttribute, PcVirtualGetter } from "../types"

const get: PcVirtualGetter<HighestAttribute> = function(this) {
  
  const physAttbOrdered = [
    { ...this.attributes.Might    , name: "Might"     as AttributeName },
    { ...this.attributes.Fortitude, name: "Fortitude" as AttributeName },
    { ...this.attributes.Agility  , name: "Agility"   as AttributeName },
  ]
  .sort((a, b) => b.value - a.value)

  return physAttbOrdered[0]
}

export default { get }
