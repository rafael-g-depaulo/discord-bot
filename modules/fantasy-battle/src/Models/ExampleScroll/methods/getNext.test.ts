import { useDbConnection } from "@discord-bot/mongo"
import { Scroll } from "../types"
import ScrollModel from ".."
import { getNextMethod } from "./getNext"

describe("ExampleScroll.getNext()", () => {
  
  useDbConnection("ExampleScroll_getNext")

  const fireboltInfo: Scroll = {
    author: "Ragan",
    title: "Firebolt",
  }
  const fireBallInfo: Scroll = {
    author: "Ragan",
    title: "Fire Ball",
  }
  const meteorInfo: Scroll = {
    author: "Ragan",
    title: "Meteor",
  }

  it("works", async () => {
    const scrolls = [
      new ScrollModel(fireboltInfo),
      new ScrollModel(fireBallInfo),
      new ScrollModel(meteorInfo),
    ]
    scrolls[0].nextLevel = scrolls[1]._id
    scrolls[1].nextLevel = scrolls[2]._id
    await Promise.all(scrolls.map(a => a.save()))

    const firstLevel = await ScrollModel.findById(scrolls[0]._id)
    const secondLevel = await ScrollModel.findById(scrolls[1]._id).populate("nextLevel")
    const thirdLevel = await ScrollModel.findById(scrolls[2]._id)
    
    // call getNextMethod
    const afterFirstLevel = await getNextMethod.call(firstLevel!)
    const afterSecondLevel = await getNextMethod.call(secondLevel!)
    
    // test that UnpopulatedScrollDocument.getNext works
    expect(afterFirstLevel).not.toBeFalsy()
    expect(secondLevel).not.toBeFalsy()
    expect(afterFirstLevel?._id).toStrictEqual(secondLevel?._id)
    expect(afterFirstLevel?.author).toBe(secondLevel?.author)
    expect(afterFirstLevel?.title).toBe(secondLevel?.title)
    
    // test that PopulatedScrollDocument.getNext works
    expect(afterSecondLevel).not.toBeFalsy()
    expect(thirdLevel).not.toBeFalsy()
    expect(afterSecondLevel?._id).toStrictEqual(thirdLevel?._id)
    expect(afterSecondLevel?.author).toBe(thirdLevel?.author)
    expect(afterSecondLevel?.title).toBe(thirdLevel?.title)
  })
})
