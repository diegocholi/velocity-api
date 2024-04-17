import { FastifyRequest, FastifyReply } from 'fastify'
import { Insert, Options, Update } from '../interfaces/IBaseDAO'

class BaseController {
  private dao: any
  private messagesResponse = {}

  constructor(dao: any) {
    this.dao = dao
  }

  public async get(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<object> {
    const params: any = request.params
    const id: number = params.id

    let page: number = 1
    let pageSize: number = 1
    const options: Options = {
      pageSize: pageSize,
      page: page,
      where: [{ column: 'id', operator: '=', value: id }],
    }
    const response: any = await this.dao.select(options)
    if (!response[0]) return reply.code(204).send()
    return reply.code(200).send(response[0])
  }

  public async list(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<object> {
    const params: any = request.query
    let page: number = params.page ? params.page : 1
    let pageSize: number = params.pageSize ? params.pageSize : 10
    const options: Options = { pageSize: pageSize, page: page, where: [] }
    for (let item in params) {
      if (item === 'page') continue
      if (item === 'pageSize') continue

      // Lógica para busca de valores diferentes
      if (String(params[item]).startsWith('!')) {
        options.where?.push({
          column: item,
          value: String(params[item]).slice(1),
          operator: '!=',
        })
        continue
      }

      // Lógica para busca com LIKE
      if (String(params[item]).startsWith('^')) {
        options.where?.push({
          column: item,
          value: String(params[item]).slice(1),
          operator: 'LIKE',
        })
        continue
      }

      // Lógica para busca de valores iguais
      options.where?.push({
        column: item,
        value: params[item],
        operator: '=',
      })
    }

    const response = await this.dao.select(options)
    if (!response[0]) return reply.code(204).send()
    return reply.code(200).send(response)
  }

  public async post(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<object> {
    const body: any = request.body

    let insert: Insert[] = []
    for (let item in body) {
      insert.push({
        column: item,
        value: body[item],
      })
    }

    const response = await this.dao.insert({ insert: insert })
    return reply.code(201).send(response)
  }

  public async update(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<object> {
    const body: any = request.body
    const params: any = request.params
    const id: number = params.id

    let update: Update = {
      values: [],
      where: [{ column: 'id', operator: '=', value: id }],
    }

    for (let item in body) {
      update.values.push({
        column: item,
        value: body[item],
      })
    }

    const response = await this.dao.update({ update: update })
    return reply.code(200).send(response)
  }

  public async delete(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<object> {
    const params: any = request.params
    const id: number = params.id

    const options: Options = {
      where: [{ column: 'id', operator: '=', value: id }],
    }
    const response: any = await this.dao.delete(options)
    return reply.code(200).send(response)
  }
}

export default BaseController
