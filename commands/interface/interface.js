#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const getChalk = require('../utils/chalk')

const { fastify, dataBase } = require('../utils/fastifyInstance')

const typeMapping = {
  // Numéricos
  int: 'number',
  smallint: 'number',
  tinyint: 'number',
  mediumint: 'number',
  bigint: 'string', // bigint é melhor representado como string para evitar problemas de precisão
  decimal: 'string', // Para precisão arbitrária, é recomendável usar string
  num: 'number',
  float: 'number',
  double: 'number',

  // Datas
  date: 'Date',
  datetime: 'Date',
  timestamp: 'Date',
  time: 'string', // TypeScript não tem tipo específico para hora sem data
  year: 'number',

  // Strings
  char: 'string',
  varchar: 'string',
  text: 'string',
  tinytext: 'string',
  mediumtext: 'string',
  longtext: 'string',
  enum: 'string', // Enums são mapeados para string; você pode querer ser mais específico no seu código
  set: 'string', // Similar ao enum

  // Binários
  binary: 'Buffer',
  varbinary: 'Buffer',
  blob: 'Buffer',
  tinyblob: 'Buffer',
  mediumblob: 'Buffer',
  longblob: 'Buffer',

  // Lógicos
  bit: 'number',
  boolean: 'boolean',

  // JSON
  json: 'any', // Pode ser tipado mais especificamente com interfaces ou tipos

  // Tipos Espaciais
  geometry: 'string',
  point: 'string',
  linestring: 'string',
  polygon: 'string',
  geometrycollection: 'string',
  multipoint: 'string',
  multilinestring: 'string',
  multipolygon: 'string',
}

const createInterface = async () => {
  const chalk = await getChalk()
  const tableName = process.argv[2]
  if (!tableName) {
    console.log(chalk.red('The table name parameter was missing'))
    process.exit(0)
  }

  await fastify.mysql.query(`USE ${dataBase}`)
  const [describle] = await fastify.mysql.query(`DESCRIBE ${tableName}`)

  const partsTableName = tableName.split('_')
  let interfaceName =
    'I' +
    partsTableName
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join('')

  // Cria o conteúdo da interface TypeScript
  let interfaceContent = `export interface ${interfaceName} {\n`

  describle.forEach((column) => {
    const tsType = typeMapping[column.Type.split('(')[0]] || 'any'
    interfaceContent += `  ${column.Field}: ${tsType}\n`
  })

  interfaceContent += '}'
  // Escreve o arquivo TypeScript
  const filePath = path.join(__dirname, `../../src/interfaces/`)
  fs.writeFile(`${filePath}${interfaceName}.ts`, interfaceContent, (err) => {
    if (err) {
      console.error(chalk.red('Error writing file:'), err)
      process.exit(0)
    }
    console.log(
      chalk.green(`Interface ${interfaceName}.ts generated successfully.`)
    )
    process.exit(0)
  })
}

fastify.ready().then(() => createInterface())
