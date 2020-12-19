import { inspect } from "util"

export const processValueIntoString = (value: any): string => inspect(value, { colors: true })
export const processArgsIntoString = (args: any[]): string => args.map(processValueIntoString).join(" ")
