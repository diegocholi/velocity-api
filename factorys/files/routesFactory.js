module.exports = (routeName, className, privateRoute, version) => {
  const path = require('path')
  const { ensureDirectoryExistence, addRoutesToFile } = require('./utils')

  let filePath = ''
  if (privateRoute)
    filePath = path.join(__dirname, `../../routes/v${version}/private.ts`)
  else filePath = path.join(__dirname, `../../routes/v${version}/public.ts`)
  // Garante que o diretório e o arquivo existem antes de escrever o arquivo
  ensureDirectoryExistence(filePath)

  // Chamando a função para modificar o arquivo
  addRoutesToFile(filePath, routeName, className)
}
