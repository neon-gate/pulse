/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest', testEnvironment: 'node', rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/reasoning/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/reasoning/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/reasoning/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/reasoning/interface/$1'
  }
}
