import tmp from "tmp"
import https from "https"
import fs from "fs"

import { PlayerUserDocument } from "../Models/PlayerUser"
import { Discord } from "@discord-bot/create-client"

export const createBackup = (player: PlayerUserDocument) => new Promise<string>((resolve, reject) => {
  tmp.file({ name: `${player.username}-backup-${Date.now()}.json` }, (err, file) => {
    if (err) return reject(err)
    fs.writeFile(file, JSON.stringify(player), err => {
      if (err) return reject(err)
      return resolve(file)
    })
  })
})

export const getObjectData = (attatchment: Discord.MessageAttachment) => new Promise<Buffer>((resolve, reject) => {
  const { url } = attatchment
  // create temp file
  tmp.file({ name: `BackupRestore-${Date.now()}-${attatchment.name}` ?? `${Date.now()}.json` }, (err, filePath) => {
    if (err) return reject(err)

    const fileWriteStream = fs.createWriteStream(filePath)
    // get data from attatchment
    https.get(url, (response) => {
      // write response into temporary file
      response.pipe(fileWriteStream)
      fileWriteStream
      // when finished writing, resolve if no error
      .on('finish', function() {
        fileWriteStream.close()
        fs.readFile(filePath, (err, data) => {
          if (err) return reject(err)
          return resolve(data)
        })
      })
      // reject on error
      .on('error', function(err) {
        fs.unlink(filePath, () => {})
        reject(err)
      })
    })
  })
})
