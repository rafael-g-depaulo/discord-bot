const mergeFlags = (...regexes: RegExp[]) => regexes.map(r => r.flags).filter((f, i, a) => a.indexOf(f) === i).join("")

// concatenate Regexes
export const concat = (...regexes: RegExp[]) => new RegExp(regexes.map(r => r.source).join(""), mergeFlags(...regexes))

// create named capture group
export const capture = (groupName: string, regex: RegExp) => new RegExp(`(?<${groupName}>${regex.source})`, regex.flags)

export const nonCapture = (regex: RegExp) => new RegExp(`(?:${regex.source})`, regex.flags)

// make a regex optional
export const optional = (regex: RegExp) => new RegExp(`(?:${regex.source})?`, regex.flags)

// make and anternation between 2 or more regexes
export const or = (...regexes: RegExp[]) => new RegExp(regexes.map(r => `${r.source}`).join("|"), mergeFlags(...regexes))
// export const or = (...regexes: RegExp[]) => new RegExp(`(?:${regexes.map(r => `${r.source}`).join("|")}`, mergeFlags(...regexes))

// make a regex that matches 1 single word that belongs to the wordList
export const fromList = (wordList: string[], flags?: string) => new RegExp(`[^\\d\\s\\w]*(?:${wordList.map(word => `${word}`).sort((a, b) => b.length - a.length).join("|")})[^\\d\\s\\w]*`, flags)

export const optionalSpace = /\s*/

const number = /\d+/

// regex for a positive signed number (must contain + sign)
export const posNum = (groupName: string) => concat(/\+/, optionalSpace, capture(groupName, number))

// regex for a negative signed number
export const negNum = (groupName: string) => concat(/-/, optionalSpace, capture(groupName, number))

// regex for a positive or negative bonus
  // ex: " - 5" captures the 5 as a negative bonus
  // ex: "+13"  captures the 13 as a positive bonus
export const signedInteger = (posGroup: string, negGroup: string) => or(posNum(posGroup), negNum(negGroup))
