module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
    commonjs: true,
  },
  extends: ['eslint:recommended'],
  ignorePatterns: ['node_modules', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': ['error', { allow: ['warn', 'error', 'info'] }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-var': 'error',
    'prefer-const': 'error',
    'eqeqeq': ['error', 'always'],
    'no-return-await': 'error',
    'consistent-return': 'off',
  },
}
