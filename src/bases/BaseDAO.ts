import { MySQLPromisePool } from '@fastify/mysql'
import FastifyApp from '../../singleton/FastifyApp'
import {
  Where,
  Insert,
  Options,
  SQLError,
  Update,
} from '../interfaces/IBaseDAO'

class BaseDAO {
  private table: string
  public constructor(table: string) {
    this.table = table
  }

  public async select(
    options: Options = {
      columns: undefined,
      where: undefined,
      pageSize: undefined,
      page: undefined,
    }
  ): Promise<object> {
    const columns = options.columns ?? ['*']
    const where = options.where ?? []
    const pageSize = options.pageSize ?? 30
    const page = ((options.page ?? 1) - 1) * pageSize

    const connection = await this.getConnection()
    try {
      const columnsFactory = columns.join(', ')
      const [whereFactory, whereValues] = this.factoryWhere(where)
      const sql = `SELECT ${columnsFactory} FROM ${this.table} ${whereFactory} LIMIT ${pageSize} OFFSET ${page}`

      const [result] = await connection.query(sql, whereValues)
      return result
    } catch (error: SQLError | any) {
      let message: string = error?.message
      if (
        message.includes(`Unknown column '`) &&
        message.includes(`in 'where clause'`)
      )
        throw {
          statusCode: 500,
          code: 'ER_BAD_FIELD_ERROR',
          error: 'Internal Server Error',
          message: 'Param not searchable',
        }

      console.error('Erro ao executar a consulta:', error)
      throw error
    }
  }

  public async insert(options: { insert: Insert[] }): Promise<object> {
    const connection = await this.getConnection()
    try {
      const [insertString, values] = this.factoryInsert(options.insert)
      const sql = `INSERT INTO ${this.table} ${insertString}`
      const [result] = await connection.query(sql, values)
      return result
    } catch (error: SQLError | any) {
      let message: string = error?.message
      if (
        message.includes(`Unknown column '`) &&
        message.includes(`' in 'field list'`)
      )
        throw {
          statusCode: 500,
          code: 'ER_BAD_FIELD_ERROR',
          error: 'Internal Server Error',
          message: 'Param not insertable',
        }
      throw error
    }
  }

  public async update(options: { update: Update }): Promise<object> {
    const connection = await this.getConnection()
    try {
      if (!options.update.where) {
        console.error("Please don't update without where")
        return {
          statusCode: 500,
          code: 'ER_BAD_ERROR',
          error: 'Internal Server Error',
          message: "Please don't update without where",
        }
      }

      const [updateString, values] = this.factoryUpdate(options.update)
      const sql = `UPDATE ${this.table} ${updateString}`

      const [result] = await connection.query(sql, values)
      return result
    } catch (error: SQLError | any) {
      throw error
    }
  }

  public async delete(options: { where: Where[] }): Promise<object> {
    const connection = await this.getConnection()
    try {
      if (!options.where) {
        console.error("Please don't delete without where")
        return {
          statusCode: 500,
          code: 'ER_BAD_ERROR',
          error: 'Internal Server Error',
          message: "Please don't update without where",
        }
      }

      const [deleteString, values] = this.factoryWhere(options.where)
      const sql = `DELETE FROM ${this.table} ${deleteString}`

      const [result] = await connection.query(sql, values)
      return result
    } catch (error: SQLError | any) {
      let message: string = error?.message
      throw error
    }
  }

  public async getConnection(): Promise<MySQLPromisePool> {
    const app: FastifyApp = await FastifyApp.instance()
    return app.mysql
  }

  private factoryInsert(insert: Insert[]): [string, any[]] {
    let columns: string[] = []
    let values: string[] = []
    let insertString: string = ''
    for (let index = 0; index < insert.length; index++) {
      const item = insert[index]
      columns.push(item.column)
      values.push(item.value)
    }

    insertString = `(${columns.join(', ')}) VALUES (${values
      .map((item) => {
        if (item === 'now') return 'NOW()'
        return '?'
      })
      .join(', ')})`

    values = values.filter((item) => item != 'now')
    return [insertString, values]
  }

  private factoryUpdate(update: Update): [string, any[]] {
    if (!update.where) return ['', [undefined]]

    const [where, valuesWhere] = this.factoryWhere(update.where)

    let columns: string[] = []
    let values: string[] = []
    let updateString: string = ''
    for (let index = 0; index < update.values.length; index++) {
      const item = update.values[index]
      columns.push(item.column)
      values.push(item.value)
    }
    values.push(...valuesWhere)
    updateString = `SET ${columns.join(' = ?, ')} = ? ${where}`
    return [updateString, values]
  }

  private factoryWhere(where: Where[]): [string, any[]] {
    if (where.length == 0) return ['', []]

    let whereFactory = ''
    let whereValues: any[] = []

    for (let index = 0; index < where.length; index++) {
      const item = where[index]
      const logicalOperator =
        index + 1 != where.length ? item.logicalOperator || 'AND' : ''

      if (item.operator === 'IN' || item.operator === 'NOT IN') {
        // Verifica se value é um array e procede com o mapeamento
        if (Array.isArray(item.value)) {
          const placeholders = item.value.map(() => '?').join(', ')
          whereFactory += ` ${item.column} ${item.operator} (${placeholders}) ${logicalOperator}`
          whereValues.push(...item.value)
        } else {
          console.error(
            'Erro: Esperado um array de valores para operador IN/NOT IN'
          )
        }
        continue
      }

      if (item.operator === 'LIKE') {
        whereFactory += ` ${item.column} ${item.operator} ? ${logicalOperator}`
        whereValues.push(`%${item.value}%`)
        continue
      }

      if (item.operator === 'BETWEEN') {
        // Verifica se value é um array e procede com o mapeamento
        if (Array.isArray(item.value)) {
          const placeholders = item.value.map(() => '?').join(' AND ')
          whereFactory += ` ${item.column} ${item.operator} ${placeholders} ${logicalOperator}`
          whereValues.push(...item.value)
        } else {
          console.error(
            'Erro: Esperado um array de duas posições para operador BETWEEN'
          )
        }
        continue
      }

      whereFactory += ` ${item.column} ${item.operator} ? ${logicalOperator}`
      whereValues.push(item.value)
    }
    if (whereFactory) whereFactory = 'WHERE ' + whereFactory.slice(1)
    return [whereFactory, whereValues]
  }
}

export default BaseDAO
