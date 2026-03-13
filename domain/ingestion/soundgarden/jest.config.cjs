/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/soundgarden/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/soundgarden/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/soundgarden/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/soundgarden/interface/$1'
  }
}
