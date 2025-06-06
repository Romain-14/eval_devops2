export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        process: "readonly"
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: true
    },
    plugins: {},
    rules: {}
  }
];
