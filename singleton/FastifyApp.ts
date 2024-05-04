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
  private DATABASE = process.env.DATABASE
  private DB_USER = process.env.DB_USER
  private DB_PASSWORD = process.env.DB_PASSWORD
  private DB_HOST = process.env.DB_HOST
  private DB_PORT = process.env.DB_PORT

  public server: FastifyInstance
  public mysql: MySQLPromisePool

  private constructor() {
    this.server = fastify()
  }

  private async _initialize() {
    try {
      await this.server.register(fastifyMySQL, {
        promise: true,
        connectionString: `mysql://${this.DB_USER}:${this.DB_PASSWORD}@${this.DB_HOST}:${this.DB_PORT}/${this.DATABASE}`,
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
