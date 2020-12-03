import Discord from "discord.js"
import { Composable } from "./Composer"

export interface LoginState {
  client: Discord.Client
}

export interface LoginClient {
  login: (token?: string) => Promise<string>,
}

export const CreateLoginClient: Composable<LoginState, LoginClient> = (state) => {
  const {
    client
  } = state

  const login: (token?: string) => Promise<string> = token => {
    return client.login(token)
  }
  
  return {
    login,
  }
}
