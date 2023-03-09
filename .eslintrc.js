module.exports = {
  extends: ['alloy', 'alloy/typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    // todo: https://github.com/AlloyTeam/eslint-config-alloy/issues/239
    '@typescript-eslint/no-unused-vars': ['error'],
    // todo: https://github.com/AlloyTeam/eslint-config-alloy/issues/241
    'no-undef': ['off'],
  },
};
