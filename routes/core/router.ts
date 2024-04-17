import { FastifyInstance } from 'fastify'
import FastifyApp from '../../singleton/FastifyApp'
import publicRoutes from '../public'
import privateRoutes from '../private'
import authMiddleware from '../../middleware/authMiddleware'

export default async (app: FastifyApp) => {
  const router: FastifyInstance = app.server

  publicRoutes.map((route) => {
    switch (route.method) {
      case 'GET':
        router.get(route.route, route.handler)
        break
      case 'POST':
        router.post(route.route, route.handler)
        break
      case 'PATCH':
        router.patch(route.route, route.handler)
        break
      case 'DELETE':
        router.delete(route.route, route.handler)
        break
    }
  })

  privateRoutes.map((route) => {
    switch (route.method) {
      case 'GET':
        router.get(route.route, {
          preHandler: authMiddleware,
          handler: route.handler,
        })
        break
      case 'POST':
        router.post(route.route, {
          preHandler: authMiddleware,
          handler: route.handler,
        })
        break
      case 'PATCH':
        router.patch(route.route, {
          preHandler: authMiddleware,
          handler: route.handler,
        })
        break
      case 'DELETE':
        router.delete(route.route, {
          preHandler: authMiddleware,
          handler: route.handler,
        })
        break
    }
  })
}
