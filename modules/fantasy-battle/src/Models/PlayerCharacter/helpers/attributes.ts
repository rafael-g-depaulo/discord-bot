import { fromList } from "@discord-bot/regex"
import { AttributeName } from "../types"

type AttbMap<T> = { [key in AttributeName]: T }

export const alternateAttributeNames: AttbMap<string[]> = {
  Agility: [
    "agilidade",
    "agility",
    "agilit",
    "agil",
    "agi",
  ],
  Fortitude: [
    "fortitude",
    "fort",
    "for",
  ],
  Might: [
    "might",
    "mihgt",
    "migth",
    "migh",
    "mig",
    "mgt",
    "strength",
    "strenthg",
    "strenhtg",
    "str",
    "stren",
    "forca",
    "força",
  ],
  Learning: [
    "learning",
    "learn",
    "lear",
    "lea",
    "aprendizado",
    "aprendiz",
    "aprend",
    "apren",
    "apre",
  ],
  Logic: [
    "logic",
    "logi",
    "log",
    "lógica",
    "lógic",
    "lógi",
    "lóg",
  ],
  Perception: [
    "perception",
    "percept",
    "percep",
    "perce",
    "pcpt",
    "perc",
    "pcp",
    "percepcao",
    "percepçao",
    "percepção",
  ],
  Will: [
    "will",
    "wil",
    "vontade",
    "vont"
  ],
  Deception: [
    "deception",
    "decepção",
    "decepcão",
    "decepçao",
    "decepcao",
    "decept",
    "decep",
    "dec",
  ],
  Persuasion: [
    "persuasion",
    "persuation",
    "persuasao",
    "persuazao",
    "persuasão",
    "persuazão",
    "pers",
  ],
  Presence: [
    "presence",
    "presenca",
    "presença",
    "prese",
  ],
  Alteration: [
    "alteration",
    "alterasion",
    "alteracao",
    "alteracão",
    "alteraçao",
    "alteração",
    "alter",
    "alte",
    "alt",
    "al",
  ],
  Creation: [
    "creation",
    "creat",
    "crea",
    "cre",
    "criacao",
    "criacão",
    "criaçao",
    "criação",
    "cria",
    "cri",
  ],
  Energy: [
    "energy",
    "energia",
    "ener",
    "ene",
  ],
  Entropy: [
    "entropy",
    "entropia",
    "entrop",
    "entro",
    "entr",
    "ent",
  ],
  Influence: [
    "influencia",
    "influência",
    "influence",
    "influ",
    "infl",
    "inf",
  ],
  Movement: [
    "movement",
    "move",
    "mov",
    "movimento",
    "movim",
    "movi",
  ],
  Prescience: [
    "presciencia",
    "presciência",
    "prescience",
    "presciên",
    "prescien",
    "presci",
    "presc",
  ],
  Protection: [
    "protection",
    "proteção",
    "protect",
    "proteç",
    "protec",
    "prot",
    "pro",
  ]
}

export const attributeNamesRegexes: AttbMap<RegExp> = Object.fromEntries(
  Object
  .entries(alternateAttributeNames)
  .map(([attbName, attbNicknames]) => [attbName, fromList(attbNicknames.sort((a, b) => b.length - a.length))])
) as AttbMap<RegExp>

export const attributeNameRegex: RegExp = fromList(
  Object
  .values(alternateAttributeNames)
  .flat()
)

export const getAttributeByNickname = (nickname: string): AttributeName | null => {
  // get all names for which nickname is an alias of
  const names = Object
    .entries(alternateAttributeNames)
    .map(([attb, aliases]) => aliases.includes(nickname.toLowerCase()) ? attb : null)
    .filter(name => name !== null)

  // if no name found that works, return null
  if (names.length === 0) return null

  // return the first name that works for this nickname(and only, if i programmed this right)
  return names[0] as AttributeName
}
