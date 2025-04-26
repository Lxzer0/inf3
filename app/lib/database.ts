import 'server-only'
import { DB } from './types'
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'

export const db = new Kysely<DB>({
    dialect: new PostgresDialect({
        pool: new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: {
                rejectUnauthorized: false,
            },
        }),
    }),
})