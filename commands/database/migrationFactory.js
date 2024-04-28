#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const getChalk = require('../utils/chalk')

// Função para criar o arquivo SQL vazio
async function createSQLFile() {
  const chalk = await getChalk()
  // Obtém a data e hora atuais
  const now = new Date()
  const timestamp = now.toISOString().replace(/:/g, '-').slice(0, 19)

  // Lê o argumento do console (parâmetro adicional)
  const param = process.argv[2] // Assume que o parâmetro é o terceiro argumento

  if (!param) {
    console.error(chalk.red('Missing parameter with file name'))
    process.exit(0)
  }

  // Define o nome do arquivo incluindo a data, hora e o parâmetro fornecido
  const nomeArquivo = `${timestamp}-${param}.sql`

  const migrationsDir = path.join(__dirname, '../../database/migrations')
  fs.writeFile(`${migrationsDir}/` + nomeArquivo, '', (err) => {
    if (err) throw err
    console.log(chalk.green(`SQL file created successfully: ${nomeArquivo}`))
  })
}

// Chamando a função para criar o arquivo
createSQLFile()
