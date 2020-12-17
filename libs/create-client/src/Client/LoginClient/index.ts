import Discord from "discord.js"
import { Composable } from "../../Composer"
import console from "../../Utils/console"

export interface LoginProps {
  discordClient: Discord.Client
  token?: string,
}

interface LoginClientState {
  isLoggedIn: boolean
}

export interface LoginClient {
  login: (token?: string) => Promise<string>,
  isLoggedIn: boolean,
}

export const CreateLoginClient: Composable<LoginProps, LoginClient> = (props) => {
  const {
    discordClient,
    token,
  } = props

  // create state
  const state: LoginClientState = {
    isLoggedIn: false,
  }
  
  const login: (token?: string) => Promise<string> = async (token) => {

    // if already logged in, throw
    if (state.isLoggedIn) throw new Error(`create-client: LoginClient.login(): tried to .login() when already logged in`)

    state.isLoggedIn = true
    
    return discordClient.login(token)
      .then(t => {
        console.log("discord-client: logged in")
        return t
      })
      .catch((err: string) => {
        state.isLoggedIn = false
        console.error(`create-client: LoginClient.login(): ${err}`)
        throw new Error(`create-client: LoginClient.login(): ${err}`)
      })
  }
  
  // if used a login prop, log into discord automatically
  if (token) { login(token) }

  return {
    login,
    get isLoggedIn() { return state.isLoggedIn },
  }
}
