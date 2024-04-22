import FastifyApp from './singleton/FastifyApp'
import bootstrap from './bootstrap/main'

async function main() {
  const app = await FastifyApp.instance()
  bootstrap(app)

  app.server.listen({ port: 8080 }, (err, address) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log(`Server listening at ${address}`)
  })
}

main()
