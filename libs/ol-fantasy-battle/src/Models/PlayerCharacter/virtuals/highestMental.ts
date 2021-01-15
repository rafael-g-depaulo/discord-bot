import { AttributeName, HighestAttribute, PcVirtualGetter } from "../types"

const get: PcVirtualGetter<HighestAttribute> = function(this) {
  
  const mentalAttbsOrdered = [
    { ...this.attributes.Learning   , name: "Learning"   as AttributeName },
    { ...this.attributes.Logic      , name: "Logic"      as AttributeName },
    { ...this.attributes.Will       , name: "Will"       as AttributeName },
    { ...this.attributes.Perception , name: "Perception" as AttributeName },
  ]
  .sort((a, b) => b.value - a.value)

  return mentalAttbsOrdered[0]
}

export default { get }
