import {Config} from 'jest';

const config: Config = {
  preset: 'jest-puppeteer',
  transform: {
    '^.+\\.ts': 'ts-jest',
  },
  setupFiles: ['dotenv-override-true/config'],
  testTimeout: 128000,
  testRegex: '.*\\.spec\\.ts$',
  collectCoverage: true,
  coverageDirectory: '.coverage',
};

export default config;
