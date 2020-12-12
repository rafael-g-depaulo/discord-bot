import { CreateModuleClient } from "./ModuleClient"


describe("moduleClient", () => {
  describe(".addModule", () => {
    it("calls addCommand correctly when a module is added", () => {
      const addCommand = jest.fn()
      const removeCommand = jest.fn()
      const moduleClient = CreateModuleClient({ addCommand, removeCommand })
      
      // create module to be added
      const cmd1 = { execute: jest.fn(), test: jest.fn(), id: "command_1" }
      const cmd2 = { execute: jest.fn(), test: jest.fn(), id: "command_2" }
      const module = {
        commands: [ cmd1, cmd2 ],
        id: "module_test",
      }

      // add module
      moduleClient.addModule(module)
      
      expect(addCommand).toHaveBeenCalledTimes(2)
      expect(addCommand).toHaveBeenCalledWith(cmd1)
      expect(addCommand).toHaveBeenCalledWith(cmd2)
    })
  })
  
  describe(".removeModule", () => {
    it("calls removeCommand correctly when a module is removed by it's id", () => {
      const addCommand = jest.fn()
      const removeCommand = jest.fn()
      const moduleClient = CreateModuleClient({ addCommand, removeCommand })

      // create module to be added
      const cmd1 = { execute: jest.fn(), test: jest.fn(), id: "command_1" }
      const cmd2 = { execute: jest.fn(), test: jest.fn(), id: "command_2" }
      const module = {
        commands: [ cmd1, cmd2 ],
        id: "module_test",
      }

      // add module
      moduleClient.addModule(module)

      // remove module
      moduleClient.removeModule("module_test")
      
      expect(removeCommand).toHaveBeenCalledTimes(2)
      expect(removeCommand).toHaveBeenCalledWith(cmd1)
      expect(removeCommand).toHaveBeenCalledWith(cmd2)
    })

    it("throws when called with an incorrect id", () => {
      const addCommand = jest.fn()
      const removeCommand = jest.fn()
      const moduleClient = CreateModuleClient({ addCommand, removeCommand })

      // create module to be added
      const cmd1 = { execute: jest.fn(), test: jest.fn(), id: "command_1" }
      const cmd2 = { execute: jest.fn(), test: jest.fn(), id: "command_2" }
      const module = {
        commands: [ cmd1, cmd2 ],
        id: "module_test",
      }

      // add module
      moduleClient.addModule(module)

      // remove module and expect error
      expect(() => moduleClient.removeModule("module_test123")).toThrowError(`create-client: ModuleClient.removeModule: tried to remove module by string id, but received incorrect id: "module_test123"`)
      expect(removeCommand).toHaveBeenCalledTimes(0)
    })

    it("calls removeCommand correctly when a module is removed by reference", () => {
      const addCommand = jest.fn()
      const removeCommand = jest.fn()
      const moduleClient = CreateModuleClient({ addCommand, removeCommand })

      // create module to be added
      const cmd1 = { execute: jest.fn(), test: jest.fn(), id: "command_1" }
      const cmd2 = { execute: jest.fn(), test: jest.fn(), id: "command_2" }
      const module = {
        commands: [ cmd1, cmd2 ],
        id: "module_test",
      }

      // add module
      moduleClient.addModule(module)

      // remove module
      moduleClient.removeModule(module)
      
      expect(removeCommand).toHaveBeenCalledTimes(2)
      expect(removeCommand).toHaveBeenCalledWith(cmd1)
      expect(removeCommand).toHaveBeenCalledWith(cmd2)
    })

    it("throws when called with a module reference that wasn't yet added", () => {
      const addCommand = jest.fn()
      const removeCommand = jest.fn()
      const moduleClient = CreateModuleClient({ addCommand, removeCommand })

      // create module to be added
      const cmd1 = { execute: jest.fn(), test: jest.fn(), id: "command_1" }
      const cmd2 = { execute: jest.fn(), test: jest.fn(), id: "command_2" }
      const module = {
        commands: [ cmd1, cmd2 ],
        id: "module_test",
      }

      // don't add module
      // moduleClient.addModule(module)

      // remove module and expect error
      expect(() => moduleClient.removeModule(module)).toThrowError(`create-client: ModuleClient.removeModule: tried to remove module by reference, but given module is not there to be removed: ${module.id}`)
    })

  })
})
