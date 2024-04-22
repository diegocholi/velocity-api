module.exports = (className, tableName, answerApiVersion) => {
  const fs = require('fs')
  const path = require('path')
  const { daoTemplate } = require('./templates')
  const {
    ensureDirectoryExistence,
  } = require('../utils/ensureDirectoryExistence')

  // Caminho onde o arquivo TypeScript será salvo
  const daoFilePath = path.join(
    __dirname,
    `../../src/DAO/v${answerApiVersion}/${className}DAO.ts`
  )
  ensureDirectoryExistence(daoFilePath)

  // Criando os arquivos
  fs.writeFile(daoFilePath, daoTemplate(className, tableName), (err) => {
    if (err) {
      console.error('An error occurred while creating the file:', err)
    } else {
      console.log('DAO file created successfully!')
    }
  })
}
