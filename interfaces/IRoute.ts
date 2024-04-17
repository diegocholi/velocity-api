import { FastifyReply, FastifyRequest } from 'fastify'

export interface IRoute {
  route: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  handler: (req: FastifyRequest, res: FastifyReply) => void
}
