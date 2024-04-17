const fs = require('fs')
const path = require('path')

// Obtém a data e hora atuais
const now = new Date()
const timestamp = now.toISOString().replace(/:/g, '-').slice(0, 19)

// Lê o argumento do console (parâmetro adicional)
const param = process.argv[2] // Assume que o parâmetro é o terceiro argumento

if (!param) {
  console.error('Faltou parâmetro com o nome do arquivo')
  process.exit(0)
}

// Define o nome do arquivo incluindo a data, hora e o parâmetro fornecido
const nomeArquivo = `${timestamp}-${param}.sql`

// Função para criar o arquivo SQL vazio
function createSQLFile() {
  const migrationsDir = path.join(__dirname, '../../database/migrations')
  fs.writeFile(`${migrationsDir}/` + nomeArquivo, '', (err) => {
    if (err) throw err
    console.log(`Arquivo SQL criado com sucesso: ${nomeArquivo}`)
  })
}

// Chamando a função para criar o arquivo
createSQLFile()
