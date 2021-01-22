import PcModel from "../../PlayerCharacter"
import DefenseModel from "../../PcDefense"
import ResourceModel from "../../PcResource"

import { PlayerUserDocument, PlayerUserStaticMethod } from "../types"

type dataObject = { [key in string]?: any }

export interface restoreUserBackup {
  (userData: dataObject): Promise<PlayerUserDocument | null>,
}

export const restoreUserBackup: PlayerUserStaticMethod<restoreUserBackup> = async function(this, userData) {
  if (typeof userData !== 'object' || userData === null) return null

  // return null if doesn't have necessary properties
  if (!userData.hasOwnProperty("userId")) return null
  if (!userData.hasOwnProperty("username")) return null
  if (!userData.hasOwnProperty("characters") || !Array.isArray(userData?.characters)) return null

  const {
    characters,
    userId,
    username,
  } = userData

  const restoredUser = this.createUser({ userId, username })
  // create activeCharIndex
  restoredUser.activeCharIndex = characters.length === 0
    ? undefined
    : Math.max(0, Number(userData?.activeCharIndex) || -Infinity)

  // retore characters
  characters.forEach(charData => {
    if (!charData.hasOwnProperty("hp")) return
    if (!charData.hasOwnProperty("mp")) return
    if (!charData.hasOwnProperty("guard")) return
    if (!charData.hasOwnProperty("dodge")) return

    // remove old id's
    delete charData._id
    delete charData.hp._id
    delete charData.mp._id
    delete charData.guard._id
    delete charData.dodge._id

    // create character
    const charDoc = new PcModel(charData)
    charDoc.hp = new ResourceModel(charData.hp)
    charDoc.mp = new ResourceModel(charData.mp)
    charDoc.guard = new DefenseModel(charData.guard)
    charDoc.dodge = new DefenseModel(charData.dodge)

    // add to player
    restoredUser.addCharacter(charDoc)
  })

  return restoredUser
}

export default restoreUserBackup
