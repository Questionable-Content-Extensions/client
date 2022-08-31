module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  env: {
    browser: true,
    es6: true,
  },
  extends: 'plugin:flowtype/recommended',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2, { SwitchCase: 1 }],
    quotes: ['error', 'double', { avoidEscape: true }],
    semi: ['error', 'always'],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: false,
    },
  },
};
