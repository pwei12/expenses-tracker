module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true,
    es6: true,
    'cypress/globals': true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    'no-use-before-define': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'prettier/prettier': ['error']
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'prettier',
    'prettier/react',
    'plugin:cypress/recommended'
  ],
  plugins: ['react', 'prettier', 'react-hooks', 'cypress']
};
