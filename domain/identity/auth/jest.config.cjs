/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/auth/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/auth/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/auth/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/auth/interface/$1'
  }
}
