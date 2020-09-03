/* eslint-disable quote-props */
/* eslint-disable quotes */
module.exports = {
  "env": {
    "browser": true,
    "es2020": true,
    "node": true,
  },
  "extends": [
    "eslint:recommended",
    "airbnb-base",
  ],
  "parserOptions": {
    "ecmaVersion": 11,
    "sourceType": "module",
  },
  "rules": {
    "no-underscore-dangle": "off",
    // "linebreak-style": ["error", "windows"],
  },
};
