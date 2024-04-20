const fs = require('fs')
const path = require('path')
const { fileRouteTemplate, routesTemplate } = require('./templates')

// Função para garantir a criação do diretório e arquivos das rotas
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath)
  if (
    fs.existsSync(dirname) &&
    fs.existsSync(`${dirname}/private.ts`) &&
    fs.existsSync(`${dirname}/public.ts`)
  ) {
    return true
  }

  // Criando diretório caso não exista
  if (!fs.existsSync(dirname)) fs.mkdirSync(dirname)

  // Criando arquivos caso não existam
  if (!fs.existsSync(`${dirname}/private.ts`))
    fs.writeFile(
      `${dirname}/private.ts`,
      fileRouteTemplate('Private'),
      (err) => {
        if (err) {
          console.error('Error writing to file:', err)
        } else {
          console.log('New private routes added successfully!')
        }
      }
    )

  if (!fs.existsSync(`${dirname}/public.ts`))
    fs.writeFile(`${dirname}/public.ts`, fileRouteTemplate('Public'), (err) => {
      if (err) {
        console.error('Error writing to file:', err)
      } else {
        console.log('New public routes added successfully!')
      }
    })

  ensureDirectoryExistence(filePath)
}

// Função para ler o arquivo e adicionar as novas rotas
function addRoutesToFile(filePath, routeName, className) {
  // Checar se o arquivo existe
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath)
    return
  }
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err)
      return
    }
    // Adicionando novas rotas ao método factoryRoutes
    const lines = data.split('\n')
    const newLines = []
    let insideFactoryRoutes = false
    for (let line of lines) {
      newLines.push(line)
      if (line.includes(`export default [`)) {
        newLines.splice(
          -2,
          0,
          `import ${className}Controller from '../../src/controllers/${className}Controller'`
        )
      }

      // Checando se estamos no método factoryRoutes
      if (line.includes('export default [')) {
        insideFactoryRoutes = true
      }

      // Verificando se ainda estamos dentro do método e chegamos no final dele
      if (insideFactoryRoutes && line.includes('] as IRoute[]')) {
        // Adicionar as novas linhas antes da chave que fecha o método
        newLines.splice(-1, 0, routesTemplate(routeName, className))
        insideFactoryRoutes = false // Sair do método após adicionar as linhas
      }
    }

    // Salvando as alterações de volta no arquivo
    fs.writeFile(filePath, newLines.join('\n'), (err) => {
      if (err) {
        console.error('Error writing to file:', err)
      } else {
        console.log('New routes added successfully!')
      }
    })
  })
}

module.exports = { ensureDirectoryExistence, addRoutesToFile }
