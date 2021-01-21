import { fstat } from "fs"
import { file } from "tmp"
import fs from "fs"

import { PlayerUserDocument } from "../Models/PlayerUser"

export const createBackup = (player: PlayerUserDocument) => new Promise<string>((resolve, reject) => {
  file({ name: `${player.username}-backup-${Date.now()}.json` }, (err, file) => {
    if (err) return reject(err)
    fs.writeFile(file, JSON.stringify(player), err => {
      if (err) return reject(err)
      return resolve(file)
    })
  })
})
