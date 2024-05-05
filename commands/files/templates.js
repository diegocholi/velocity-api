// Template de rotas
const routesTemplate = (className) => `  {
    route: '/${String(className).toLowerCase()}',
    method: 'GET',
    handler: (req, res) => ${className}Controller.list(req, res),
  },
  {
    route: '/${String(className).toLowerCase()}/:id',
    method: 'GET',
    handler: (req, res) => ${className}Controller.get(req, res),
  },
  {
    route: '/${String(className).toLowerCase()}',
    method: 'POST',
    handler: (req, res) => ${className}Controller.post(req, res),
  },
  {
    route: '/${String(className).toLowerCase()}/:id',
    method: 'PUT',
    handler: (req, res) => ${className}Controller.update(req, res),
  },
  {
    route: '/${String(className).toLowerCase()}/:id',
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

const testTemplate = (
  className,
  answerApiVersion
) => `import bootstrap from '../bootstrap/main'
import FastifyApp from '../singleton/FastifyApp'

let fastify: FastifyApp

describe('${className}', () => {
  let insertId: Number = 0

  beforeAll(async () => {
    fastify = await FastifyApp.instance()
    bootstrap('/v${answerApiVersion}/${String(className).toLowerCase()}')
  })

  afterAll(() => {
    fastify.server.close() // Fecha o servidor após os testes
  })

  test('POST /v${answerApiVersion}/${String(
  className
).toLowerCase()}', async () => {
    const newItem = {
      ...Your test data
    }
    const response: any = await fastify.server.inject({
      method: 'POST',
      url: '/v${answerApiVersion}/${String(className).toLowerCase()}',
      body: newItem,
    })

    const body = JSON.parse(response.body)
    insertId = body.insertId
    expect(response.statusCode).toBe(201)
    expect(body.affectedRows).toEqual(1)
  })

  test('LIST /v${answerApiVersion}/${String(
  className
).toLowerCase()}', async () => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/v${answerApiVersion}/${String(className).toLowerCase()}',
    })

    expect(response.statusCode).toBe(200)
  })

  test('PUT /v${answerApiVersion}/${String(
  className
).toLowerCase()}/:id', async () => {
    const updatedItem = {
      ...Your test data
    }

    const response: any = await fastify.server.inject({
      method: 'PUT',
      url: \`/v${answerApiVersion}/${String(
  className
).toLowerCase()}/\${insertId}\`,
      body: updatedItem,
    })

    const body = JSON.parse(response.body)
    expect(body.affectedRows).toEqual(1)
  })

  test('GET /api/items/:id', async () => {
    const response: any = await fastify.server.inject({
      method: 'GET',
      url: \`/v${answerApiVersion}/${String(
  className
).toLowerCase()}/\${insertId}\`,
    })

    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
  })

  test('DELETE /v${answerApiVersion}/${String(
  className
).toLowerCase()}/:id', async () => {
    const response = await fastify.server.inject({
      method: 'DELETE',
      url: \`/v${answerApiVersion}/${String(
  className
).toLowerCase()}/\${insertId}\`,
    })
    const body = JSON.parse(response.body)
    expect(body.affectedRows).toEqual(1)
  })
})
`

module.exports = {
  fileRouteTemplate,
  routesTemplate,
  daoTemplate,
  controllerTemplate,
  testTemplate,
}
