/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@application/(.*)$': '<rootDir>/src/transcription/application/$1',
    '^@domain/(.*)$': '<rootDir>/src/transcription/domain/$1',
    '^@infra/(.*)$': '<rootDir>/src/transcription/infra/$1',
    '^@interface/(.*)$': '<rootDir>/src/transcription/interface/$1'
  }
}
