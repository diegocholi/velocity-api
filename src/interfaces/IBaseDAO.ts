export interface Where {
  column: string
  operator:
    | '='
    | '<>'
    | '!='
    | '>'
    | '>='
    | '<'
    | '<='
    | 'LIKE'
    | 'IN'
    | 'NOT IN'
    | 'BETWEEN'
  value: string | string[] | number | number[]
  logicalOperator?: 'AND' | 'OR'
}

export interface Insert {
  column: string
  value: string
}

export interface Update {
  values: Array<{
    column: string
    value: string
  }>
  where?: Where[]
}

export interface Options {
  columns?: string[]
  where?: Where[]
  pageSize?: number
  page?: number
}

export interface SQLError {
  code: string
  errno: number
  message: string
  sql: string
  sqlMessage: string
  sqlState: string
}
