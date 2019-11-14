module.exports = {
    collectCoverage: false,
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    preset: 'jest-puppeteer',
    roots: ['<rootDir>/tests'],
    setupFiles: ['<rootDir>/node_modules/dotenv/config'],
    testPathIgnorePatterns: ['./node_modules'],
    testRegex: '/tests/.*\\.test\\.ts$',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
};
