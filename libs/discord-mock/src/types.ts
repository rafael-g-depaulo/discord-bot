export type Without<T, K> = Pick<T, Exclude<keyof T, K>>

export type DiscordPartial<T> = Partial<Without<T, "valueOf">>
