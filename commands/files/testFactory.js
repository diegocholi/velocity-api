module.exports = (className, answerApiVersion) => {
  const fs = require('fs')
  const path = require('path')
  const { testTemplate } = require('./templates')
  const testFilePath = path.join(__dirname, `../../tests`)

  fs.writeFile(
    `${testFilePath}/${String(
      className
    ).toLowerCase()}.v${answerApiVersion}.test.ts`,
    testTemplate(className, answerApiVersion),
    (err) => {
      if (err) {
        console.error('An error occurred while creating the file:', err)
      } else {
        console.log('Test file created successfully!')
      }
    }
  )
}
