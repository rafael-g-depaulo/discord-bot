// return type T, but make property K optional
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
