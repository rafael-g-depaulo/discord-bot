import createClient from "."

describe('create-client', () => {
  
  it("doesn't throw without options", () => {
    expect(() => {
      createClient()
    }).not.toThrow()
  })
  
  it("doesn't throw with empty options", () => {
    expect(() => {
      const options = {}
      createClient(options)
    }).not.toThrow()
  })

  describe("connection", () => {
    it("tries to login when login method is called", () => {
      // TODO
      // const client = createClient()
      // const token = "sdfgfjdfsdgfhkgxfhdsfgvsdxhg"
      // client.login(token)
      //   .then((a) => console.log("logged in fucker", a))
    })
  })
})
