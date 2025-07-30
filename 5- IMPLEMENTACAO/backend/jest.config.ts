module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/__tests__/setup.ts'], // Arquivo de setup que criaremos
  testMatch: ['**/__tests__/**/*.test.ts'],
};