import { EngineReportingOptions } from 'apollo-engine-reporting'
import { ConnectionOptions } from 'typeorm'
import { Environment } from '@/constants'

type Config = {
  [key in Environment]: {
    db: ConnectionOptions
    apolloEngine?: EngineReportingOptions<unknown>
  }
}

const defaultDbConfig = {
  logging: false,
  entities: ['src/modules/**/*.model.ts'],
  migrations: ['migrations/**/*.ts'],
  subscribers: ['src/subscribers/**/*.ts'],
  cli: {
    entitiesDir: 'src/modules',
    migrationsDir: 'migrations',
    subscribersDir: 'src/subscribers',
  },
}

const _config: Config = {
  [Environment.DEVELOPMENT]: {
    db: {
      ...defaultDbConfig,
      type: 'postgres',
      database: 'scorekeep',
      host: 'localhost',
      port: 5432,
      username: 'scorekeep-admin',
      password: "ADAM's COOL",
      synchronize: true,
    },
  },
  [Environment.TEST]: {
    db: {
      ...defaultDbConfig,
      type: 'sqlite',
      database: 'sqlite/test.sqlite3',
      dropSchema: true,
    },
  },
  [Environment.PRODUCTION]: {
    db: {
      ...defaultDbConfig,
      type: 'postgres',
      database: 'scorekeep',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
    },
    apolloEngine: {
      apiKey: process.env.APOLLO_ENGINE_KEY,
    },
  },
}

export const config = _config[process.env.NODE_ENV as Environment]