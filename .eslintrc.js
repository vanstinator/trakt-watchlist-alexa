module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  globals: {
    ENV_LOCAL: 'readonly',
    ENV_DEV: 'readonly',
    ENV_PROD: 'readonly',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    // sourceType: "module",
  },
  plugins: ['import', 'simple-import-sort', '@typescript-eslint'],
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
  ],
  rules: {
    indent: ['error', 2],
    'no-multiple-empty-lines': ['error', { max: 1 }],
    'linebreak-style': ['error', 'unix'],
    'quote-props': ['error', 'as-needed'],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-trailing-spaces': 'error',
    'callback-return': 'error',
    'keyword-spacing': 'error',
    'comma-spacing': 'error',
    'import/newline-after-import': 'error',
    'import/no-useless-path-segments': 'error',
    'import/order': 'off',
    'simple-import-sort/sort': [
      'error',
      {
        groups: [
          // Node.js builtins. You could also generate this regex if you use a `.js` config.
          // For example: `^(${require('module').builtinModules.join('|')})(/|$)`
          [
            '^(assert|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|https|module|net|os|path|punycode|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|vm|zlib|freelist|v8|process|async_hooks|http2|perf_hooks)(/.*|$)',
          ],
          // Packages. `react` related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@|@company|@ui|components|utils|config|vendored-lib)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put `..` last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and `.` last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$'],
        ],
      },
    ],
    'object-curly-spacing': ['error', 'always'],
  },
};
