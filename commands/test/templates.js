const testTemplate = (
  route,
  answerApiVersion
) => `import bootstrap from '../bootstrap/main'
import FastifyApp from '../singleton/FastifyApp'

let fastify: FastifyApp

describe('${route}', () => {
  let insertId: Number = 0

  beforeAll(async () => {
    fastify = await FastifyApp.instance()
    bootstrap('/v${answerApiVersion}/${String(route).toLowerCase()}')
  })

  afterAll(() => {
    fastify.server.close() // Fecha o servidor após os testes
  })

  test('POST /v${answerApiVersion}/${String(
  route
).toLowerCase()}', async () => {
    const newItem = {
      ...Your test data
    }
    const response: any = await fastify.server.inject({
      method: 'POST',
      url: '/v${answerApiVersion}/${String(route).toLowerCase()}',
      body: newItem,
    })

    const body = JSON.parse(response.body)
    insertId = body.insertId
    expect(response.statusCode).toBe(201)
    expect(body.affectedRows).toEqual(1)
  })

  test('LIST /v${answerApiVersion}/${String(
  route
).toLowerCase()}', async () => {
    const response = await fastify.server.inject({
      method: 'GET',
      url: '/v${answerApiVersion}/${String(route).toLowerCase()}',
    })

    expect(response.statusCode).toBe(200)
  })

  test('PUT /v${answerApiVersion}/${String(
  route
).toLowerCase()}/:id', async () => {
    const updatedItem = {
      ...Your test data
    }

    const response: any = await fastify.server.inject({
      method: 'PUT',
      url: \`/v${answerApiVersion}/${String(
  route
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
  route
).toLowerCase()}/\${insertId}\`,
    })

    const body = JSON.parse(response.body)
    expect(response.statusCode).toBe(200)
  })

  test('DELETE /v${answerApiVersion}/${String(
  route
).toLowerCase()}/:id', async () => {
    const response = await fastify.server.inject({
      method: 'DELETE',
      url: \`/v${answerApiVersion}/${String(
  route
).toLowerCase()}/\${insertId}\`,
    })
    const body = JSON.parse(response.body)
    expect(body.affectedRows).toEqual(1)
  })
})
`

module.exports = {
  testTemplate,
}
