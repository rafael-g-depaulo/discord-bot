import { Command, RegexCommand } from "@discord-bot/create-client"

import { commandWithoutFlags } from "../Utils/regex"

export const test: RegexCommand.test = commandWithoutFlags(
  /help/
)

const commandHelpString = (cmdName: string, cmdDescription: string) =>
  `\n\t"${cmdName}" -> ${cmdDescription}`

export const execute: RegexCommand.execute = async (message) => {
  message.channel.send(`The available commands are:`
    + commandHelpString("!help"                                  , "recursão!"                                                                       )
    + commandHelpString("!createRoles"                           , "Criar as roles de player e Mestre no servidor"                              )
    + commandHelpString("!createChar"                            , "Criar um novo personagem"                                                   )
    + commandHelpString("!setActiveChar (charName)"              , "Mudar o personagem ativo"                                                   )
    + commandHelpString("!listChars"                             , "Listar todos os personagens de um player"                                   )
    + commandHelpString("!deleteChar (charName)"                 , "Deletar um personagem"                                                      )
    + commandHelpString("!viewBio"                               , "Ver as informações de um personagem"                                        )
    + commandHelpString("!viewStats"                             , "Ver as informações de um personagem (resumido)"                             )
    + commandHelpString("!setAtkAttb"                            , "Modificar o attributo padrão de ataque de um personagem"                    )
    + commandHelpString("!setAttb"                               , "Modificar o valor/bonus de um attributo de um personagem"                   )
    + commandHelpString("!setLvl"                                , "Modificar o nível de um personagem"                                         )
    + commandHelpString("!set (hp/mp) scaling"                   , "Modificar como o hp/mp de um personagem escalam com os seus atributos"      )
    + commandHelpString("!set (guard/dodge) Scaling"             , "Modificar como o guard/dodge de um personagem escalam com os seus atributos")
    + commandHelpString("!(attbName) [bonus] [vantagem+x]"       , "Rolar um atributo"                                                          )
    + commandHelpString("!atk [(attbName)] [bonus] [vantagem+x]" , "Rolar um ataque"                                                            )
    + commandHelpString("!dmg [(attbName)] [bonus] [vantagem+x]" , "Rolar dano"                                                                 )
    + commandHelpString("!initiative [bonus] [vantagem+x]"       , "Rolar iniciativa"                                                           )
    + commandHelpString("!takeDmg (numero)"                      , "Tomar dano usando as defesas do personagem"                                 )
    + commandHelpString("!dmgTable [numero]"                     , "Checar a tabela de dano ou rolar um attributo de dano"                           )
    + commandHelpString("!(hp|mp) +/- (numero)"                  , "Para mudar o hp/mp do personagem"                                                )
    + commandHelpString("!shortRest"                             , "Fazer um descanso curto"                                                         )
    + commandHelpString("!longRest"                              , "Fazer um descanso longo"                                                         )
  )
}

export const help: Command = {
  id: "Fantasy Battle: help",
  test,
  execute,
}

export default help
