module.exports = (className, privateRoute) => {
  const fs = require('fs')
  const path = require('path')
  //   Caminho para o arquivo que você quer modificar
  let filePath = ''
  if (privateRoute) filePath = path.join(__dirname, '../../routes/private.ts')
  else filePath = path.join(__dirname, '../../routes/public.ts')

  const routeName = String(className).toLowerCase()
  const routes = `  {
    route: '/${routeName}',
    method: 'GET',
    handler: (req, res) => ${className}Controller.list(req, res),
  },
  {
    route: '/${routeName}/:id',
    method: 'GET',
    handler: (req, res) => ${className}Controller.get(req, res),
  },
  {
    route: '/${routeName}',
    method: 'POST',
    handler: (req, res) => ${className}Controller.post(req, res),
  },
  {
    route: '/${routeName}/:id',
    method: 'PATCH',
    handler: (req, res) => ${className}Controller.update(req, res),
  },
  {
    route: '/${routeName}/:id',
    method: 'DELETE',
    handler: (req, res) => ${className}Controller.delete(req, res),
  },`

  // Função para ler o arquivo e adicionar as novas rotas
  function addRoutesToFile(filePath) {
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
            `import ${className}Controller from '../src/controllers/${className}Controller'`
          )
        }

        // Checando se estamos no método factoryRoutes
        if (line.includes('export default [')) {
          insideFactoryRoutes = true
        }

        // Verificando se ainda estamos dentro do método e chegamos no final dele
        if (insideFactoryRoutes && line.includes('] as IRoute[]')) {
          // Adicionar as novas linhas antes da chave que fecha o método
          newLines.splice(-1, 0, routes)
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
  // Chamando a função para modificar o arquivo
  addRoutesToFile(filePath)
}
