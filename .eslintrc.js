module.exports = {
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      modules: true,
      spread: true,
      restParams: true,
    },
  },
  env: {
    es6: true,
    browser: true,
    node: true,
    jquery: true,
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-unused-vars': ['warn'],
    'no-console': ['warn'],
    'comma-dangle': ['warn', 'only-multiline'],
    'curly': ['off'],
    'semi': ['off'],
    'camelcase': ['warn'],
    'import/no-extraneous-dependencies': ['off'],
    'no-param-reassign': ['warn'],
    'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
    'class-methods-use-this': ['warn'],
    'import/no-import-module-exports': ['off'],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'func-names': ['off'],
  },
  settings: {
    'import/resolver': {
      'node': {
        'extensions': ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
}
