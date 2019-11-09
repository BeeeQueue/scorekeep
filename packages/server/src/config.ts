// eslint-disable-next-line node/no-extraneous-import
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
  type: 'postgres' as const,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USER || 'scorekeep-admin',
  password: process.env.DATABASE_PASS || "ADAM's COOL",
  database: 'postgres',
  url: process.env.DATABASE_URL,
  schema: 'scorekeep',

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
      schema: 'scorekeep-dev',
      synchronize: true,
    },
  },
  [Environment.TEST]: {
    db: {
      ...defaultDbConfig,
      schema: 'scorekeep-tests',
      synchronize: true,
      dropSchema: true,
    },
  },
  [Environment.PRODUCTION]: {
    db: {
      ...defaultDbConfig,
      schema: 'scorekeep-prod',
      url: process.env.DATABASE_URL,
      migrationsRun: true,
    },
    apolloEngine: {
      apiKey: process.env.APOLLO_ENGINE_KEY,
    },
  },
}

export const config = _config[process.env.NODE_ENV as Environment]