import nextJest from 'next/jest.js'
import type { Config } from 'jest'

const createJestConfig = nextJest({
  dir: './',
})

// ESM-only dependencies that Jest (CommonJS) can't load untransformed.
const ESM_ONLY_PACKAGES = ['uuid']

const config: Config = {
  coverageProvider: 'v8',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: [
    'src/app/api/auth/(.*)',
    'src/clients/*',
    'auth-providers.ts',
    'auth.ts',
    'index.ts',
    'mocks/',
    'types.ts',
    'types/',
    'utils/test-utils-node.ts',
    'utils/test-utils.ts',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'clover', 'json-summary', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  clearMocks: true,
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  modulePaths: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

// next/jest ignores all of node_modules (except Next's own transpiled packages)
// and only lets custom transformIgnorePatterns be appended, which can't
// un-ignore a package. Prefix its node_modules patterns with a lookahead so
// files inside ESM_ONLY_PACKAGES never match and get transformed by SWC.
const skipEsmOnlyPackages = String.raw`^(?!.*[\\/]node_modules[\\/](?:${ESM_ONLY_PACKAGES.join('|')})[\\/])`

export default async function jestConfig(): Promise<Config> {
  const nextJestConfig = await createJestConfig(config)()

  return {
    ...nextJestConfig,
    transformIgnorePatterns: nextJestConfig.transformIgnorePatterns?.map(
      pattern =>
        pattern.includes('node_modules')
          ? `${skipEsmOnlyPackages}.*${pattern}`
          : pattern,
    ),
  }
}
