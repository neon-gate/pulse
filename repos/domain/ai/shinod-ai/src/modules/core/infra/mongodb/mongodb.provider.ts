import { requireStringEnv } from '@env/lib'

/// Returns the MongoDB connection URI from the environment.
export function mongoUri(): string {
  return requireStringEnv('MONGO_URI')
}

/// Returns the MongoDB database name from the environment.
export function mongoDbName(): string {
  return requireStringEnv('MONGO_DB_NAME')
}
