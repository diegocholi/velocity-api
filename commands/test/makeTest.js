const makeTest = async () => {
  const fs = require('fs')
  const path = require('path')
  const { testTemplate } = require('./templates')
  const testFilePath = path.join(__dirname, `../../tests`)
  const { close, question } = require('../utils/consoleQuestion')

  const route = await question('Which route are you creating the test for? ')
  if (!route) {
    console.error(chalk.red('Missing parameter with route name'))
    process.exit(0)
  }

  let answerApiVersion = undefined
  while (true) {
    answerApiVersion = await question(
      'What version of the API are you creating the test for? (use numbers: 1, 2, 3...) '
    )
    if (!isNaN(answerApiVersion) && answerApiVersion) break
  }

  const filePathWithNameFile = `${testFilePath}/${String(
    String(route).split('/').join('.')
  ).toLowerCase()}.v${answerApiVersion}.test.ts`

  fs.writeFile(
    filePathWithNameFile,
    testTemplate(route, answerApiVersion),
    (err) => {
      if (err) {
        console.error('An error occurred while creating the file:', err)
      } else {
        console.log('Test file created successfully!')
      }
    }
  )

  close()
}

makeTest()
