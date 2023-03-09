module.exports = {
  extends: ['alloy', 'alloy/typescript', 'prettier'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': ['error'],
    // todo: https://github.com/AlloyTeam/eslint-config-alloy/issues/239
    '@typescript-eslint/no-unused-vars': ['error'],
    'no-undef': ['off'],
  },
  env: {
    jest: true,
  },
};
