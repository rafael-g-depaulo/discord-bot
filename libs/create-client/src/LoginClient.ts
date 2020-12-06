import Discord from "discord.js"
import { Composable } from "Composer"

export interface LoginProps {
  discordClient: Discord.Client
}

export interface LoginClient {
  login: (token?: string) => Promise<string>,
}

export const CreateLoginClient: Composable<LoginProps, LoginClient> = (props) => {
  const {
    discordClient,
  } = props

  const login: (token?: string) => Promise<string> = token => {
    return discordClient.login(token)
  }

  return {
    login,
  }
}
