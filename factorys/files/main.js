const daoFactory = require('./daoFactory')
const controllerFactory = require('./controllerFactory')
const routesFactory = require('./routesFactory')

const className = process.argv[2]
if (!className) {
  console.error('Faltou parâmetro com o nome das classes')
  process.exit(0)
}

const tableName = process.argv[3]
if (!tableName) {
  console.error('Faltou parâmetro com o nome da tabela do banco de dados')
  process.exit(0)
}

let privateRoute = false
for (let index = 0; index < process.argv.length; index++) {
  const args = process.argv[index]
  if (args === 'private') {
    privateRoute = true
  }
}

daoFactory(className, tableName)
controllerFactory(className)
routesFactory(className, privateRoute)
