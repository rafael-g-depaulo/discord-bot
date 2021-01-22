import ScrollModel, { Skill } from "./index"

import { useDbConnection } from "@discord-bot/mongo"

describe("SkillModel", () => {
  
  useDbConnection("SkillModel")

  describe("CRUD", () => {
    it("creates", async () => {})
    it("reads", async () => {})
    it("updates", async () => {})
    it("deletes", async () => {})
  })

  describe("virtuals", () => {})
  describe("statics", () => {})
  describe("methods", () => {})
})
