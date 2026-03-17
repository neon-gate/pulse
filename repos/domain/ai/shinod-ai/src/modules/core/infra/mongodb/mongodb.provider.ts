import { requireStringEnvCompute } from '@repo/environment'

/// Returns the MongoDB connection URI from the environment.
export function mongoUri(): string {
  return requireStringEnvCompute('MONGO_URI')
}

/// Returns the MongoDB database name from the environment.
export function mongoDbName(): string {
  return requireStringEnvCompute('MONGO_DB_NAME')
}
