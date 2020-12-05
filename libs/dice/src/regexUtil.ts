const mergeFlags = (...regexes: RegExp[]) => regexes.map(r => r.flags).filter((f, i, a) => a.indexOf(f) === i).join("")

// concatenate Regexes
export const concat = (...regexes: RegExp[]) => new RegExp(regexes.map(r => r.source).join(""), mergeFlags(...regexes))

// create named capture group
export const capture = (groupName: string, regex: RegExp) => new RegExp(`(?<${groupName}>${regex.source})`, regex.flags)

// make a regex optional
export const optional = (regex: RegExp) => new RegExp(`(?:${regex.source})?`, regex.flags)

// make and anternation between 2 regexes
export const or = (reg1: RegExp, reg2: RegExp) => new RegExp(`(?:${reg1.source})|(?:${reg2.source})`, mergeFlags(reg1, reg2))

// make a regex that matches 1 single word that belongs to the wordList
export const fromList = (wordList: string[], flags?: string) => new RegExp(`(?:${wordList.map(word => `\\b${word}\\b`).join("|")})`, flags)
