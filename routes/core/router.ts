import { FastifyInstance } from 'fastify'
import FastifyApp from '../../singleton/FastifyApp'
import authMiddleware from '../../middleware/authMiddleware'
import { IRoute } from '../../interfaces/IRoute'

const mountRoutes = (
  routes: IRoute[],
  router: FastifyInstance,
  version: string,
  isPrivate: boolean = false
) => {
  router.register(
    async (router: FastifyInstance) => {
      if (isPrivate) {
        routes.map((route) => {
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
        return
      }
      routes.map((route) => {
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
    },
    { prefix: version }
  )
}

export default async (app: FastifyApp) => {
  const router: FastifyInstance = app.server
  const path = require('path')
  const fs = require('fs')
  const dir: string = path.join(__dirname, '../../routes')
  const files: Array<string> = fs.readdirSync(dir)
  for (let index = 0; index < files.length; index++) {
    const dirRoutes: string = files[index]
    if (dirRoutes.includes('v')) {
      const routesFiles: Array<string> = fs.readdirSync(`${dir}/${dirRoutes}`)
      const privateRoute = require(`${dir}/${dirRoutes}/${routesFiles[0]}`)
      const publicRoute = require(`${dir}/${dirRoutes}/${routesFiles[1]}`)
      mountRoutes(publicRoute.default, router, dirRoutes)
      mountRoutes(privateRoute.default, router, dirRoutes, true)
    }
  }
  return
}
