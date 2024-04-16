const fastify = require('fastify')()
const fs = require('fs')
const path = require('path')
const dataBase = 'wp_auth'
require('dotenv').config()

fastify.register(require('@fastify/mysql'), {
  promise: true,
  connectionString: process.env.MYSQL_CONNECTION_STRING,
})

const migrationsDir = path.join(__dirname, 'migrations')

async function applyMigration(fileName) {
  const filePath = path.join(migrationsDir, fileName)
  const sql = fs.readFileSync(filePath, { encoding: 'utf-8' })
  try {
    await fastify.mysql.query(sql)
    console.log(`Applied migration: ${fileName}`)
  } catch (err) {
    console.error(`Error applying migration ${fileName}:`, err)
    process.exit(1)
  }
}

async function migrate() {
  await fastify.mysql.query('CREATE DATABASE IF NOT EXISTS wp_auth')
  await fastify.mysql.query(`USE ${dataBase}`)
  await fastify.mysql.query(
    'CREATE TABLE IF NOT EXISTS migrations (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)'
  )
  const [appliedMigrations] = await fastify.mysql.query(
    'SELECT name FROM migrations'
  )

  const appliedSet = new Set(appliedMigrations.map((row) => row.name))

  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((file) => !appliedSet.has(file))

  for (const file of migrationFiles.sort()) {
    await applyMigration(file)
    await fastify.mysql.query('INSERT INTO migrations (name) VALUES (?)', [
      file,
    ])
  }

  console.log('All migrations applied successfully')
  process.exit(0)
}

fastify.ready().then(() => migrate())
