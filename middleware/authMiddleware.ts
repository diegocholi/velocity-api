import { FastifyReply, FastifyRequest } from 'fastify'

async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
  done: Function
) {
  const token = request.headers['authorization']
  if (!token) {
    reply.status(401).send({ message: 'Não autorizado. Token não fornecido.' })
    return
  }
  try {
    done()
  } catch (error) {
    reply.status(400).send({ message: 'Token inválido.' })
  }
}

export default authMiddleware
