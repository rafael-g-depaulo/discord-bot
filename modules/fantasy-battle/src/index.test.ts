import console, { LogLevel } from "@discord-bot/logging"
import ScrollModel, { Scroll, ScrollDocument, ScrollPopulatedDocument } from "Models/ExampleScroll"
import { inspect } from 'util'

import { connect } from "./Db"
// import { ScrollModel, Scroll } from "./Models/Scroll"

const log = (s: any) => {
  const logString = inspect(s, { colors: true })
  console.log(logString, { logLevel: LogLevel.debug})
}

describe('test module', () => {
  test('sample test', async (done) => {
    const conn = await connect()

    const iceScroll: Scroll = {
      title: "ice bolt",
      author: "Ragan",
    }
    const fireScroll: Scroll = {
      title: "fire bolt",
      author: "Ragan",
    }
    const lightningScroll: Scroll = {
      title: "lightning bolt",
      author: "Marceline",
    }

    // create
    const iceScrollDoc = new ScrollModel(iceScroll)
    await iceScrollDoc.save()
    const fireScrollDoc = new ScrollModel(fireScroll)
    fireScrollDoc.nextLevel = iceScrollDoc._id
    await fireScrollDoc.save()
    const lightningScrollDoc = new ScrollModel(lightningScroll)
    await lightningScrollDoc.save()

    // log(iceScrollDoc)
    // log(iceScrollDoc.fullname)

    // test static methods
    const scrolls = await ScrollModel.getByAuthor("Ragan")
    log(scrolls)

    // test model relation
    const fScroll: ScrollPopulatedDocument | null = await ScrollModel
      .findOne({ _id: fireScrollDoc._id })
      .populate("nextLevel")
    // log(fScroll?.nextLevel)

    // test virtual properties
    log(fScroll?.fullname)
    log(fScroll?.nextLevel?.fullname)
    
    // delete
    const aaa = await Promise.all([
      iceScrollDoc,
      fireScroll,
      lightningScroll,
      ...scrolls
    ].map((scroll) => ScrollModel.deleteOne({ _id: (scroll as ScrollDocument).id })))
    // log(aaa)
    
    conn
      .disconnect()
      .then(done)
  })
})
