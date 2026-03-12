/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/mocking-bird/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/mocking-bird/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/mocking-bird/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/mocking-bird/interface/$1'
  }
}
