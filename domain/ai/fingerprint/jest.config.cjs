/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/fingerprint/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/fingerprint/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/fingerprint/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/fingerprint/interface/$1'
  }
}
