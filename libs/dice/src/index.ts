// die stuff (single die roll)
export * from "./die"
export { default as createDie } from "./die"

// dice stuff (multiple dice roll, with bonus, advantage, etc.)
export * from "./dice"
export { default as createDice } from "./dice"

// get dice roll arguments from string
export * from "./getDiceRoll"

// regex utils
export * as regex from "./regex"

// interpret dice roll results as string
export { default as resultString } from "./resultString"
