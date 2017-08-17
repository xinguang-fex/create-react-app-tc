// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'eslint:recommended',
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    "indent": ["error", 4],
    // "space-before-function-paren": ["error", 'never'],
    "no-undef": 0,
    "no-console": 0,
    "space-before-blocks": ["error", 'always'],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' || process.env.NODE_ENV == 'testing' ? 2 : 0
  }
}
