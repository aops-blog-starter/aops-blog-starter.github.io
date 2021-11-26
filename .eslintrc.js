// eslint-disable-next-line no-undef
module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 13,
  },
  'rules': {
    'indent': ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'eqeqeq': ['error', 'always'],
    'curly': ['error', 'multi'],
    'no-trailing-spaces': ['error'],
    'max-statements-per-line': ['error', {max: 1}],
    'comma-dangle': ['error', 'always-multiline'],
    'comma-spacing': [2],
    'comma-style': ['error', 'last'],
    'max-len': ['error', {code: 80}],
  },
};
