export const monoSpaced = (str: string) => "```\n" + str + "```"

export const indexAfterSubstr = (str: string, subst: string) => str
  .slice(str.indexOf(subst) + subst.length)
