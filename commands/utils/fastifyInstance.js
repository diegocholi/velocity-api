require('dotenv').config()

const DB_USER = process.env.DB_USER,
  DB_PASSWORD = process.env.DB_PASSWORD,
  DB_HOST = process.env.DB_HOST,
  DB_PORT = process.env.DB_PORT

const fastify = require('fastify')()
const dataBase = process.env.DATABASE
fastify.register(require('@fastify/mysql'), {
  promise: true,
  connectionString: `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}`,
})
module.exports = {
  fastify: fastify,
  dataBase: dataBase,
}
