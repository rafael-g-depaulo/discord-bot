import { Composable } from "../Composer"
import { Command } from "./CommandClient"

export interface Module {
  commands: Command[],
  id: string,
}

type ModuleList = Module[]

export interface ModuleProps {
  addCommand: (cmd: Command) => void,
  removeCommand: (cmd: Command | string) => void,
}

export interface ModuleClient {
  addModule: (module: Module) => void,
  removeModule: (cmd: Module | string) => void,
}

export const CreateModuleClient: Composable<ModuleProps, ModuleClient> = (props) => {
  const {
    addCommand,
    removeCommand,
  } = props

  const state = {
    modules: [] as ModuleList
  }

  const addModule = (module: Module) => {
    state.modules.push(module)
    module.commands.forEach(command => addCommand(command))
  }

  const removeModule = (module: Module | string) => {
    // if using module by id
    if (typeof module === 'string') {
      const moduleIndex = state.modules.findIndex(m => m.id === module)

      // if incorrect id, throw
      if (moduleIndex === -1) throw new Error(`create-client: ModuleClient.removeModule: tried to remove module by string id, but received incorrect id: "${module}"`)

      const commands = state.modules[moduleIndex].commands
      // remove module from module list
      state.modules.splice(moduleIndex, 1)
      // remove all commands from module
      commands.forEach(cmd => removeCommand(cmd))

    // if using module by reference
    } else { 
      // get index of module
      const moduleIndex = state.modules.indexOf(module)

      // if index not found (tried to remove module that wasn't added), throw
      if (moduleIndex === -1) throw new Error(`create-client: ModuleClient.removeModule: tried to remove module by reference, but given module is not there to be removed: ${module.id}`)

      // remove module from module list
      state.modules.splice(moduleIndex, 1)
      // remove all commands from module
      module.commands.forEach(cmd => removeCommand(cmd))
    }
  }

  return {
    addModule,
    removeModule,
  }
}
