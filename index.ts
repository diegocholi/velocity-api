import FastifyApp from './singleton/FastifyApp'
import factoryRoutes from './routes/factory/router'

async function main() {
  const app = await FastifyApp.instance()
  factoryRoutes(app)

  app.server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

main()
