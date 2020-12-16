import Discord from "discord.js"
import { MakeOptional } from "Utils/types"
import { CreateLoginClient, LoginClient, LoginProps } from "./index"

describe("LogingClient", () => {

  type MockDiscordClient = (props?: MakeOptional<LoginProps, 'discordClient'>) => [LoginClient, jest.Mock<any, any>]
  const mockDiscordClient: MockDiscordClient = (props) => {
    const mockLogin = jest.fn(a => Promise.resolve(a))
    const mockedClient = CreateLoginClient({
      ...props,
      discordClient: { login: mockLogin as Function } as Discord.Client
    })

    return [ mockedClient, mockLogin ]
  }

  it("logs in with props, if present", () => {
    const [loginClient, loginFn] = mockDiscordClient({ token: "1234_test_4321" })

    expect(loginFn).toBeCalledTimes(1)
    expect(loginFn).toBeCalledWith("1234_test_4321")

    expect(loginClient.isLoggedIn).toBe(true)
  })
  
  it("logs in with .login()", async (done) => {
    const [loginClient, loginFn] = mockDiscordClient()
    
    const token = await loginClient.login("token_test_token_test")

    expect(loginFn).toBeCalledTimes(1)
    expect(loginFn).toBeCalledWith("token_test_token_test")

    expect(token).toBe("token_test_token_test")
    expect(loginClient.isLoggedIn).toBe(true)
    done()
  })
  
  it("throws when try to .login() if already logged in", async (done) => {
    const [ loginClient1 ] = mockDiscordClient({ token: "aaaaa" })
    const [ loginClient2 ] = mockDiscordClient({})

    await loginClient2.login("aaaaa")

    expect(loginClient1.login("1234")).rejects.toEqual(Error(`create-client: LoginClient.login(): tried to .login() when already logged in`))

    expect(loginClient2.login("4321")).rejects.toEqual(Error(`create-client: LoginClient.login(): tried to .login() when already logged in`))

    done()
  })
  
  it("throws when loggin in with a bad token", async (done) => {
    const [loginClient, loginFn] = mockDiscordClient()
    loginFn.mockImplementation(a => a === "good_token" ? Promise.resolve(a) : Promise.reject(`Error [TOKEN_INVALID]: An invalid token was provided.`))
    
    expect(loginClient.login("bad_token")).rejects.toEqual(Error(`create-client: LoginClient.login(): Error [TOKEN_INVALID]: An invalid token was provided.`))
    
    done()
  })
  
})
