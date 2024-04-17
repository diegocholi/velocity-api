module.exports = (className) => {
  const fs = require('fs')
  const path = require('path')
  const controllerContent = `import ${className}DAO from '../dao/${className}DAO'
import BaseController from '../bases/BaseController'

class ${className}Controller extends BaseController {
  private static _instance: ${className}Controller = new ${className}Controller()
  public static get instance(): ${className}Controller {
    return this._instance
  }

  private constructor() {
    super(${className}DAO)
  }
}

export default ${className}Controller.instance
`

  const controllerFilePath = path.join(
    __dirname,
    `../../src/controllers/${className}Controller.ts`
  )

  fs.writeFile(controllerFilePath, controllerContent, (err) => {
    if (err) {
      console.error('An error occurred while creating the file:', err)
    } else {
      console.log('CONTROLLER file created successfully!')
    }
  })
}
