import { AttributeName, HighestAttribute, PcVirtualGetter } from "../types"

const get: PcVirtualGetter<HighestAttribute> = function(this) {
  
  const specialAttbsOrdered = [
    { ...this.attributes.Alteration , name: "Alteration" as AttributeName },
    { ...this.attributes.Creation   , name: "Creation"   as AttributeName },
    { ...this.attributes.Energy     , name: "Energy"     as AttributeName },
    { ...this.attributes.Entropy    , name: "Entropy"    as AttributeName },
    { ...this.attributes.Influence  , name: "Influence"  as AttributeName },
    { ...this.attributes.Movement   , name: "Movement"   as AttributeName },
    { ...this.attributes.Prescience , name: "Prescience" as AttributeName },
    { ...this.attributes.Protection , name: "Protection" as AttributeName },
  ]
  .sort((a, b) => b.value - a.value)

  return specialAttbsOrdered[0]
}

export default { get }
