module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    'WebViewJavascriptBridge': true,
    'nativePublicParams': true
  },
  extends: [
    // '@nuxtjs',
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: [
    'eslint-plugin-standard'
  ],
  // add your custom rules here
  rules: {
    'eqeqeq': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-v-html': false,
    'vue/max-attributes-per-line': ['error', {
      'singleline': 5,
      'multiline': {
        'max': 1,
        'allowFirstLine': false
      }
    }]
  }
}
