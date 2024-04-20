const daoFactory = require('./daoFactory')
const controllerFactory = require('./controllerFactory')
const routesFactory = require('./routesFactory')
const getChalk = require('../utils/chalk')
const { close, question } = require('../utils/consoleQuestion')

async function main() {
  const chalk = await getChalk()

  let className = await question('What is the class name? ')
  if (!className) {
    console.error(chalk.red('Missing parameter with class name'))
    process.exit(0)
  }

  const tableName = await question('What is the name of the database table? ')
  if (!tableName) {
    console.error(
      chalk.red('Missing parameter with the name of the database table')
    )
    process.exit(0)
  }

  const answerCreateRoutes = await question(
    'Do you want to create routes? (y/n) '
  )

  let answerApiVersion = undefined
  while (true) {
    answerApiVersion = await question(
      'Routes/files must be created in which version? (use numbers: 1, 2, 3...) '
    )
    if (!isNaN(answerApiVersion) && answerApiVersion) break
  }
  className = `${className}V${answerApiVersion}` // Adicionar a versão ao nome da classe/arquivo

  if (answerCreateRoutes.toLowerCase() === 'y') {
    const routeName = await question('What is the name of the route? ')
    if (!routeName) {
      console.error(chalk.red('Missing parameter with route name'))
      process.exit(0)
    }

    const answerIsPrivateRoute = await question('Is the route private? (y/n) ')
    const isPrivateRoute = answerIsPrivateRoute.toLowerCase() === 'y'
    routesFactory(routeName, className, isPrivateRoute, answerApiVersion)
  }

  daoFactory(className, tableName)
  controllerFactory(className)
  close()
}

main()
