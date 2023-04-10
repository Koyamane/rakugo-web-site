const lint = require('@umijs/lint')

module.exports = {
  ...lint.prettier,
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  proseWrap: 'never',
  arrowParens: 'avoid',
  bracketSpacing: true,
  eslintIntegration: false,
  htmlWhitespaceSensitivity: 'ignore',
  ignorePath: '.prettierignore',
  jsxBracketSameLine: false,
  jsxSingleQuote: true,
  requireConfig: false,
  stylelintIntegration: false,
  trailingComma: 'none',
  endOfLine: 'lf',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json'
      }
    },
    {
      files: 'document.ejs',
      options: {
        parser: 'html'
      }
    }
  ]
}
