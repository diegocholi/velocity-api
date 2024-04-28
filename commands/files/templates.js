// Template de rotas
const routesTemplate = (routeName, className) => `  {
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

// Template de arquivo de rotas
const fileRouteTemplate = (
  type
) => `import { IRoute } from '../../interfaces/IRoute'

export default [
  // ${type} routes
] as IRoute[]`

const daoTemplate = (
  className,
  tableName
) => `import BaseDAO from '../../../bases/BaseDAO'

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

const controllerTemplate = (
  className,
  answerApiVersion
) => `import ${className}DAO from '../../dao/v${answerApiVersion}/${className}DAO'
import BaseController from '../../../bases/BaseController'

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

module.exports = {
  fileRouteTemplate,
  routesTemplate,
  daoTemplate,
  controllerTemplate,
}
