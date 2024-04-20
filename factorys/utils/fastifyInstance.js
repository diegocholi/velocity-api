require('dotenv').config()
const fastify = require('fastify')()
const dataBase = process.env.DATABASE
fastify.register(require('@fastify/mysql'), {
  promise: true,
  connectionString: process.env.MYSQL_CONNECTION_STRING,
})
module.exports = {
  fastify: fastify,
  dataBase: dataBase,
}
