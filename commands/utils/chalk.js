async function getChalk() {
  const chalk = await import('chalk')
  return chalk.default
}

module.exports = getChalk
