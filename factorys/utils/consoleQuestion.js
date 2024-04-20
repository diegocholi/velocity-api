const readline = require('readline')
const getChalk = require('./chalk')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Função para converter rl.question para promessa
async function question(query) {
  return new Promise(async (resolve) => {
    const chalk = await getChalk()
    rl.question(chalk.blue(query), resolve)
  })
}

module.exports = { close: () => rl.close(), question: question }
