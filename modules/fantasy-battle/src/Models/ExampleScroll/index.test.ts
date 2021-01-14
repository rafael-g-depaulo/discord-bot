import ScrollModel, { Scroll } from "./index"

import { useDbConnection } from "Utils/Mongo/mongoTest"

describe("ExampleScroll", () => {
  
  useDbConnection("ExampleScroll")

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
  const iceboltInfo: Scroll = {
    author: "Bonnibel",
    title: "Icebolt",
  }

  describe("CRUD", () => {
    it("creates", async () => {
      const scroll = new ScrollModel(fireboltInfo)
      expect(scroll.title).toBe(fireboltInfo.title)
      expect(scroll.author).toBe(fireboltInfo.author)
      expect(scroll.fullname).toBe(`${fireboltInfo.author}'s ${fireboltInfo.title}`)
    })

    it("reads", async () => {
      // create and save
      const scrollDoc = new ScrollModel(fireBallInfo)
      await scrollDoc.save()

      // read scroll
      const fireBallScroll = await ScrollModel.findOne({ _id: scrollDoc._id })

      expect(fireBallScroll?.title).toBe(scrollDoc.title)
      expect(fireBallScroll?.author).toBe(scrollDoc.author)
      expect(fireBallScroll?._id).toStrictEqual(scrollDoc._id)
    })
    
    it("updates", async () => {
      const scroll = new ScrollModel(fireboltInfo)
      await scroll.save()
      
      expect(scroll.title).toBe(fireboltInfo.title)
      expect(scroll.author).toBe(fireboltInfo.author)

      scroll.author = "Cooler Author"
      await scroll.save()

      const newScroll = await ScrollModel.findOne({ _id: scroll._id })

      expect(newScroll?.title).toBe(fireboltInfo.title)
      expect(newScroll?.author).toBe(`Cooler Author`)
      expect(newScroll?.fullname).toBe(`Cooler Author's Firebolt`)
    })
    
    it("deletes", async () => {
      const scroll = new ScrollModel(fireboltInfo)
      await scroll.save()
      
      const fetchedScroll = await ScrollModel.findOne({ _id: scroll._id })
      expect(fetchedScroll).not.toBe(null)

      await scroll.deleteOne()
      
      const deletedScroll = await ScrollModel.findOne({ _id: scroll._id })
      expect(deletedScroll).toBe(null)
    })
  })

  describe("virtuals", () => {
    // virtuals for ExampleScroll were already tested for in the CRUD suite
  })

  describe("statics", () => {
    describe(".getByAuthor()", () => {
      it("works", async () => {
        // create and save scrolls
        const scrolls = [
          new ScrollModel(fireboltInfo),
          new ScrollModel(fireBallInfo),
          new ScrollModel(iceboltInfo),
        ]
        await Promise.all(scrolls.map(a => a.save()))

        const raganScrolls = await ScrollModel.getByAuthor("Ragan")

        expect(raganScrolls.length).toBe(2)
        expect(raganScrolls).toEqual(
          expect.arrayContaining([
            expect.objectContaining(fireboltInfo),
            expect.objectContaining(fireBallInfo),
          ])
        )
      })
    })
  })

  describe("methods", () => {
    describe(".getNext()", () => {
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
        
        const afterFirstLevel = await firstLevel?.getNext()
        const afterSecondLevel = await secondLevel?.getNext()
        
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
  })
})
