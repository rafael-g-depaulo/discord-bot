import { capture, concat, nonCapture, optionalSpace, or } from "@discord-bot/regex"

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

export const damageWords = /(?:dmg|damage|dano|rollDmg|rolaDano|rollDamage)/i
