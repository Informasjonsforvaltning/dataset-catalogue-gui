module.exports = {
  preset: 'ts-jest/presets/js-with-ts',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json'
    }
  },
  setupFilesAfterEnv: ['<rootDir>/test/config/setup.ts'],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transform: {
    '^.+\\.svg$': 'jest-svg-transformer'
  },
  moduleNameMapper: {
    '\\.(ttf|woff|woff2|css|less|scss)$': 'identity-obj-proxy'
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{tsx,ts,jsx,js}',
    '!src/**/*.d.ts',
    '!src/env.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
};
