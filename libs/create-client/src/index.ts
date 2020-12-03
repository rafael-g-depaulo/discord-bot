import Discord from "discord.js"

export interface ClientOptions {

}
export interface Client {

}

export type CreateClient = (options: ClientOptions) => Client


const createClient: CreateClient = (options) => {

  return {}
}

export default createClient
