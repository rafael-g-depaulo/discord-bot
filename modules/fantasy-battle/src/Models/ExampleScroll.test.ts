import connect from "Db"
import { Mongoose } from "mongoose"

describe("ExampleScroll", () => {

  // connect to mongodb
  let conn: Mongoose | null = null
  beforeAll(async (done) => {
    conn = await connect()
    // start tests after connection is estabilished
    done()
  })

  // disconnect from mongodb
  afterAll((done) => {
    conn?.disconnect()
      .then(done)
  })

  it("empty test", () => {
    
  })
})
