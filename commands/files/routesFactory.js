module.exports = (routeName, className, privateRoute, answerApiVersion) => {
  const path = require('path')
  const { ensureFilesRotes, addRoutesToFile } = require('./utils')

  let filePath = ''
  if (privateRoute)
    filePath = path.join(
      __dirname,
      `../../routes/v${answerApiVersion}/private.ts`
    )
  else
    filePath = path.join(
      __dirname,
      `../../routes/v${answerApiVersion}/public.ts`
    )

  // Garante que o diretório e os arquivos de rotas existem
  ensureFilesRotes(filePath)

  // Chamando a função para modificar o arquivo
  addRoutesToFile(filePath, routeName, className, answerApiVersion)
}
