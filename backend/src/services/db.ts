import sqlite from 'better-sqlite3'
import path from 'node:path'

import config from '@/config'

const db = new sqlite(path.resolve(config.dbPath), { fileMustExist: true })
db.pragma('journal_mode = WAL')
db.defaultSafeIntegers(false)

export const close = () => db.close()

export const query = <Result, BindParameters extends unknown[]>(
  sql: string,
  ...params: BindParameters
) => db.prepare<BindParameters, Result>(sql).all(...params)

export const querySingle = <Result, BindParameters extends unknown[]>(
  sql: string,
  ...params: BindParameters
): Result | undefined => db.prepare<BindParameters, Result>(sql).get(...params)

export const execute = <BindParameters extends unknown[]>(
  sql: string,
  ...params: BindParameters
) => {
  const statement = db.prepare<BindParameters, void>(sql)

  statement.run(...params)
}

export const executeMany = <BindParameters extends unknown[]>(
  sql: string,
  paramsArray: BindParameters[]
) => {
  const statement = db.prepare<BindParameters, void>(sql)

  for (const params of paramsArray) {
    statement.run(...params)
  }
}

export const makeTransaction = (f: (...args: unknown[]) => unknown) =>
  db.transaction(f)
