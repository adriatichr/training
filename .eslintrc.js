module.exports = {
  extends: ['airbnb', 'prettier'],
  plugins: ['markdown'],
  rules: {
    'no-use-before-define': ['error', { functions: false, classes: true }],
    'react/prop-types': ['off'],
    strict: ['off'],
    'no-console': ['off'],
    'no-plusplus': ['off'],
    'lines-around-directive': ['off'],
    'vars-on-top': ['off'],
    'func-names': ['off'],
  },
  env: {
    browser: true,
    jquery: true,
  },
};
