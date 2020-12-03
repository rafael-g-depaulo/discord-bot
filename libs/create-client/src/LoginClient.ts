import Discord from "discord.js"
import { Composable } from "Composer"

export interface LoginState {
  discordClient: Discord.Client
}

export interface LoginClient {
  login: (token?: string) => Promise<string>,
}

export const CreateLoginClient: Composable<LoginState, LoginClient> = (state) => {
  const {
    discordClient,
  } = state

  const login: (token?: string) => Promise<string> = token => {
    return discordClient.login(token)
  }

  return {
    login,
  }
}
