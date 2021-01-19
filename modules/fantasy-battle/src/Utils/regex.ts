import { capture, concat, fromList, nonCapture, optionalSpace, or } from "@discord-bot/regex"

export const flags = concat(
  optionalSpace,
  capture("flags", /.*/),
  /$/,
)

export const commandWithFlags = (...commandNames: RegExp[]) =>
  concat(
    /!/i,
    nonCapture(or(...commandNames)),
    flags,
  )

export const commandWithoutFlags = (...commandNames: RegExp[]) =>
  concat(
    /!/i,
    nonCapture(or(...commandNames)),
  )

export const setWords = /(?:set|settar|setar|sett)/i

export const atkWords = /(?:atk|attk|atkk|attkk|ataque|ataq|ataqe|ataqu|attack|atack|atak)/i
export const rollWords = /(?:roll|rol|rolar|role|rola)/i

export const damageWords = /(?:dmg|damage|dano|rollDmg|rolaDano|rollDamage)/i

export const viewWords = fromList(["view", "ver", "visu", "visualizar"])
export const charWords = fromList(["char", "chara", "charac",  "personagem", "character", "pers", "perso", "person"])
