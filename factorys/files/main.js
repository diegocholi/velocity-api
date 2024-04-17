const daoFactory = require('./daoFactory')
const controllerFactory = require('./controllerFactory')
const routesFactory = require('./routesFactory')
const { close, question } = require('../utils/consoleQuestion')

async function main() {
  const className = await question('What is the class name? ')
  if (!className) {
    console.error('Missing parameter with class name')
    process.exit(0)
  }

  const tableName = await question('What is the name of the database table? ')
  if (!tableName) {
    console.error('Missing parameter with the name of the database table')
    process.exit(0)
  }

  const answerCreateRoutes = await question(
    'Do you want to create routes? (y/n) '
  )

  if (answerCreateRoutes.toLowerCase() === 'y') {
    const answerIsPrivateRoute = await question('Is the route private? (y/n) ')
    const isPrivateRoute = answerIsPrivateRoute.toLowerCase() === 'y'
    routesFactory(className, isPrivateRoute)
  }

  daoFactory(className, tableName)
  controllerFactory(className)
  close()
}

main()
