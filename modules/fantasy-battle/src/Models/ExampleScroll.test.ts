import ScrollModel, { Scroll } from "./ExampleScroll"

import { useDbConnection } from "Utils/mongoTest"

describe("ExampleScroll", () => {
  
  useDbConnection("ExampleScroll")

  const fireBoltInfo: Scroll = {
    author: "Ragan",
    title: "Firebolt"
  }
  const fireBallInfo: Scroll = {
    author: "Ragan",
    title: "Fire Ball"
  }
  const meteorInfo: Scroll = {
    author: "Ragan",
    title: "Meteor"
  }

  describe("CRUD", () => {
    it("creates", async () => {
      const scroll = new ScrollModel(fireBoltInfo)
      expect(scroll.title).toBe(fireBoltInfo.title)
      expect(scroll.author).toBe(fireBoltInfo.author)
      expect(scroll.fullname).toBe(`${fireBoltInfo.author}'s ${fireBoltInfo.title}`)
    })

    it("reads", async () => {
      // create and save
      const scrollDoc = new ScrollModel(fireBallInfo)
      await scrollDoc.save()

      // read scroll
      const fireBallScroll = await ScrollModel.findOne({ _id: scrollDoc.id })

      expect(fireBallScroll?.title).toBe(scrollDoc.title)
      expect(fireBallScroll?.author).toBe(scrollDoc.author)
      expect(fireBallScroll?._id).toStrictEqual(scrollDoc._id)
    })
    
    it("updates", async () => {
      const scroll = new ScrollModel(fireBoltInfo)
      await scroll.save()
      
      expect(scroll.title).toBe(fireBoltInfo.title)
      expect(scroll.author).toBe(fireBoltInfo.author)

      scroll.author = "Cooler Author"
      await scroll.save()

      const newScroll = await ScrollModel.findOne({ _id: scroll._id })

      expect(newScroll?.title).toBe(fireBoltInfo.title)
      expect(newScroll?.author).toBe(`Cooler Author`)
      expect(newScroll?.fullname).toBe(`Cooler Author's Firebolt`)
    })
    
    it("deletes", async () => {
      const scroll = new ScrollModel(fireBoltInfo)
      await scroll.save()
      
      const fetchedScroll = await ScrollModel.findOne({ _id: scroll._id })
      expect(fetchedScroll).not.toBe(null)

      await scroll.deleteOne()
      
      const deletedScroll = await ScrollModel.findOne({ _id: scroll._id })
      expect(deletedScroll).toBe(null)
    })
  })
})
