/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/fort-minor/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/fort-minor/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/fort-minor/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/fort-minor/interface/$1'
  }
}
