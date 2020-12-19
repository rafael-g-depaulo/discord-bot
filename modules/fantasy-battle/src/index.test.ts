import ScrollModel, { Scroll, ScrollDocument, ScrollPopulatedDocument } from "Models/ExampleScroll"
import console from "Utils/logger"

import { connect } from "./Db"
// import { ScrollModel, Scroll } from "./Models/Scroll"

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

    // console.log(iceScrollDoc)
    // console.log(iceScrollDoc.fullname)

    // test static methods
    const scrolls = await ScrollModel.getByAuthor("Ragan")
    console.log(scrolls)

    // test model relation
    const fScroll: ScrollPopulatedDocument | null = await ScrollModel
      .findOne({ _id: fireScrollDoc._id })
      .populate("nextLevel")
    // console.log(fScroll?.nextLevel)

    // test virtual properties
    console.log(fScroll?.fullname)
    console.log(fScroll?.nextLevel?.fullname)
    
    // delete
    const aaa = await Promise.all([
      iceScrollDoc,
      fireScroll,
      lightningScroll,
      ...scrolls
    ].map((scroll) => ScrollModel.deleteOne({ _id: (scroll as ScrollDocument).id })))
    // console.log(aaa)
    
    conn
      .disconnect()
      .then(done)
  })
})
