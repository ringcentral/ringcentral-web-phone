module.exports = {
  extends: ['alloy', 'alloy/typescript', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error'],
    quotes: ['error', 'single', { avoidEscape: true }],
    'prefer-const': ['error'],
  },
};
