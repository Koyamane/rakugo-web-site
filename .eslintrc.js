module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true
  },
  rules: {
    // *** 关闭 ***
    // 禁止 console
    'no-console': 0,
    // 去除 useEffect 等后面的 [] 中必填提示
    'react-hooks/exhaustive-deps': 0,
    // 要求 require() 出现在顶层模块作用域中
    'global-require': 0,
    // 禁止使用嵌套的三元表达式
    'no-nested-ternary': 0,
    // 禁止对函数参数再赋值
    'no-param-reassign': 0,
    // index 做 key
    'react/no-array-index-key': 0,
    // 关闭导入 interface 时需要加 type 的问题
    '@typescript-eslint/consistent-type-imports': 0,
    '@typescript-eslint/consistent-type-definitions': 0,

    // *** 警告 ***
    // 对象字面量中冒号的前后空格
    'key-spacing': [
      1,
      {
        beforeColon: false,
        afterColon: true
      }
    ],
    '@typescript-eslint/no-unused-expressions': [
      1,
      {
        // 禁止无用的表达式
        allowShortCircuit: true,
        allowTernary: true
      }
    ],

    // *** 错误 ***
    // 禁用一元操作符 ++ 和 --
    'no-plusplus': [
      'error',
      {
        allowForLoopAfterthoughts: true
      }
    ],
    // 禁用使用分号
    semi: [2, 'never'],
    // 禁用使用分号
    '@typescript-eslint/semi': [2, 'never'],
    // 使用单引号, 默认false(在jsx中配置无效, 默认都是双引号)
    quotes: [2, 'single', { avoidEscape: true }],
    // 对象字面量项尾不能有逗号
    'comma-dangle': [2, 'never'],
    // 不能有警告备注
    'no-warning-comments': [
      2,
      {
        terms: ['fixme', 'any other term'],
        location: 'anywhere'
      }
    ],
    'no-restricted-syntax': ['error', 'WithStatement']
  }
}
