module.exports = {
  root:true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion:6
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  extends: ['eslint:recommended'],
  // plugins:['prettier'],
  rules:{
    // 'prettier/prettier': 'error',
    'no-debugger':process.env.NODE_ENV === 'production' ? 2:0,
    'no-console': process.env.NODE_ENV === 'production' ? 2:0
  },
  globals:{
    App:true,
    Page:true,
    getApp:true,
    wx:true,
    Component:true
  }
}
