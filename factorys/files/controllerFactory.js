module.exports = (className, answerApiVersion) => {
  const fs = require('fs')
  const path = require('path')
  const {
    ensureDirectoryExistence,
  } = require('../utils/ensureDirectoryExistence')
  const { controllerTemplate } = require('./templates')

  const controllerFilePath = path.join(
    __dirname,
    `../../src/controllers/v${answerApiVersion}/${className}Controller.ts`
  )
  ensureDirectoryExistence(controllerFilePath)
  fs.writeFile(
    controllerFilePath,
    controllerTemplate(className, answerApiVersion),
    (err) => {
      if (err) {
        console.error('An error occurred while creating the file:', err)
      } else {
        console.log('CONTROLLER file created successfully!')
      }
    }
  )
}
