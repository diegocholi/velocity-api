// Função para garantir a criação do diretório
function ensureDirectoryExistence(filePath) {
  const path = require('path')
  const fs = require('fs')
  const dirname = path.dirname(filePath)
  if (fs.existsSync(dirname)) {
    return true
  }
  fs.mkdirSync(dirname)
  ensureDirectoryExistence(dirname)
}

module.exports = { ensureDirectoryExistence }
