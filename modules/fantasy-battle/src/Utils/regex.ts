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
