// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    useJSXTextNode: true,
    project: './tsconfig.json',
    // tsconfigRootDir: '../../',
    extraFileExtensions: ['.ts']
  },
  env: {
    browser: true,
    amd: true,
    jasmine: true,
    node: true,
    es6: true
  },
  globals: {
    setImmediate: true,
    ActiveXObject: true,
    unescape: true,
    escape: true,
    Promise: true
  },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended'],
  // add your custom rules here
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off'
  }
};
