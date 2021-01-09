import { AttributeName, HighestAttribute, PcVirtualGetter } from "../types"

const get: PcVirtualGetter<HighestAttribute> = function(this) {
  
  const socialAttbsOrdered = [
    { ...this.attributes.Deception  , name: "Deception"  as AttributeName },
    { ...this.attributes.Persuasion , name: "Persuasion" as AttributeName },
    { ...this.attributes.Presence   , name: "Presence"   as AttributeName },
  ]
  .sort((a, b) => b.value - a.value)

  return socialAttbsOrdered[0]
}

export default { get }
