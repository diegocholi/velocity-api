#!/usr/bin/env node

async function main() {
  const daoFactory = require('./daoFactory')
  const controllerFactory = require('./controllerFactory')
  const routesFactory = require('./routesFactory')
  const testFactory = require('./testFactory')
  const getChalk = require('../utils/chalk')
  const { close, question } = require('../utils/consoleQuestion')

  const chalk = await getChalk()

  const className = await question('What is the class name? ')
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

  let answerApiVersion = undefined
  while (true) {
    answerApiVersion = await question(
      'Routes/files must be created in which version? (use numbers: 1, 2, 3...) '
    )
    if (!isNaN(answerApiVersion) && answerApiVersion) break
  }

  const answerCreateRoutes = await question(
    'Do you want to create routes? (y/n) '
  )

  if (answerCreateRoutes.toLowerCase() === 'y') {
    const answerIsPrivateRoute = await question('Is the route private? (y/n) ')
    const isPrivateRoute = answerIsPrivateRoute.toLowerCase() === 'y'
    routesFactory(className, isPrivateRoute, answerApiVersion)
  }

  daoFactory(className, tableName, answerApiVersion)
  controllerFactory(className, answerApiVersion)
  testFactory(className, answerApiVersion)
  close()
}

main()
