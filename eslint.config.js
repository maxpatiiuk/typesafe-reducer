const eslintConfig = require('@maxxxxxdlp/eslint-config');
const globals = require('globals');

module.exports = [
  ...eslintConfig,
  {
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];
