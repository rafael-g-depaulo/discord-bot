import { useDbConnection } from "@discord-bot/mongo"
import ScrollModel from ".."
import { Scroll } from "../types"
import getByAuthor from "./getByAuthor"

describe("ExampleScrollModel.getByAuthor()", () => {
  
  useDbConnection("ExampleScroll_getByAuthor")

  const fireboltInfo: Scroll = {
    author: "Ragan",
    title: "Firebolt",
  }
  const fireBallInfo: Scroll = {
    author: "Ragan",
    title: "Fire Ball",
  }
  const iceboltInfo: Scroll = {
    author: "Bonnibel",
    title: "Icebolt",
  }

  it("works", async () => {
    // create and save scrolls
    const scrolls = [
      new ScrollModel(fireboltInfo),
      new ScrollModel(fireBallInfo),
      new ScrollModel(iceboltInfo),
    ]
    await Promise.all(scrolls.map(a => a.save()))

    // call static method
    const raganScrolls = await getByAuthor.call(ScrollModel, "Ragan")

    expect(raganScrolls.length).toBe(2)
    expect(raganScrolls).toEqual(
      expect.arrayContaining([
        expect.objectContaining(fireboltInfo),
        expect.objectContaining(fireBallInfo),
      ])
    )
  })
})
