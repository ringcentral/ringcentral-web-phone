module.exports = {
    collectCoverage: true,
    coverageDirectory: '.coverage',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    testPathIgnorePatterns: ['./node_modules'],
    testRegex: '/src/.*\\.test\\.ts$',
    testEnvironment: 'node'
};
