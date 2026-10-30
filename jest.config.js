/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.test.{js,ts,tsx}',
    '<rootDir>/tests/**/*.test.{js,ts,tsx}',
  ],
  clearMocks: true,
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.css$': '<rootDir>/tests/support/style.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!\\.pnpm/|msw/|ky/|cookie/|tough-cookie/|headers-polyfill/|set-cookie-parser/|@msw/|@mswjs/|is-node-process/|rettime/|until-async/|@open-draft/)',
  ],
  transform: {
    '^.+\\.[cm]?[jt]sx?$': [
      'babel-jest',
      {
        babelrc: false,
        configFile: false,
        plugins: ['./tests/support/vite-base-transform.js'],
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }],
          '@babel/preset-typescript',
        ],
      },
    ],
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', 'build/**/*.ts', '!src/**/__tests__/**'],
  coverageProvider: 'v8',
  coverageThreshold: {
    global: { statements: 90, branches: 90, functions: 90, lines: 90 },
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov'],
};
