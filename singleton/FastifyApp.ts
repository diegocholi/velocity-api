import fastify, { FastifyInstance } from 'fastify'
import fastifyMySQL, { MySQLPromisePool } from '@fastify/mysql'
import 'dotenv/config'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromisePool
  }
}

class FastifyApp {
  private static _instance: FastifyApp
  private _database = process.env.DATABASE
  public server: FastifyInstance
  public mysql: MySQLPromisePool

  private constructor() {
    this.server = fastify()
  }

  private async _initialize() {
    try {
      await this.server.register(fastifyMySQL, {
        promise: true,
        connectionString:
          process.env.MYSQL_CONNECTION_STRING + `/${this._database}`,
      })
      this.mysql = this.server.mysql
      console.log('------ Initialized Server ------')
    } catch (err: any) {
      console.error(err)
      process.exit(1)
    }
  }

  public static async instance(): Promise<FastifyApp> {
    if (!FastifyApp._instance) {
      FastifyApp._instance = new FastifyApp()
      await FastifyApp._instance._initialize()
    }
    return FastifyApp._instance
  }
}

export default FastifyApp
