module.exports = (className, tableName) => {
  const fs = require('fs')
  const path = require('path')
  const daoContent = `import BaseDAO from '../bases/BaseDAO'

class ${className}DAO extends BaseDAO {
  private static _instance: ${className}DAO = new ${className}DAO()
  public static get instance(): ${className}DAO {
    return this._instance
  }

  private constructor() {
    super('${tableName}')
  }
}

export default ${className}DAO.instance
`
  // Caminho onde o arquivo TypeScript será salvo
  const daoFilePath = path.join(__dirname, `../../src/DAO/${className}DAO.ts`)

  // Criando os arquivos
  fs.writeFile(daoFilePath, daoContent, (err) => {
    if (err) {
      console.error('An error occurred while creating the file:', err)
    } else {
      console.log('DAO file created successfully!')
    }
  })
}
