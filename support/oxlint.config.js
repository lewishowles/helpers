// Blank-line rules between statement kinds.
const paddingLineBetweenStatements = [
  "error",
  { blankLine: "always", prev: "const", next: "let" },
  { blankLine: "always", prev: "let", next: "const" },
  { blankLine: "always", prev: "*", next: "break" },
  { blankLine: "always", prev: ["const", "let"], next: "*" },
  { blankLine: "always", prev: "*", next: "return" },
  { blankLine: "any", prev: "const", next: "const" },
  { blankLine: "any", prev: "let", next: "let" },
  { blankLine: "always", prev: "multiline-const", next: "*" },
  { blankLine: "always", prev: "*", next: "multiline-const" },
];

export default {
  plugins: ["oxc", "unicorn"],
  jsPlugins: [
    "@stylistic/eslint-plugin",
    {
      name: "vite-plus",
      specifier: "vite-plus/oxlint-plugin",
    },
  ],
  categories: {
    correctness: "error",
  },
  env: {
    builtin: true,
    browser: true,
  },
  ignorePatterns: ["**/dist/*", "support/"],
  rules: {
    // Extra checks not included in "correctness" above.
    "no-case-declarations": "error",
    "no-empty": "error",
    "no-fallthrough": "error",
    "no-prototype-builtins": "error",
    "no-redeclare": "error",
    "no-regex-spaces": "error",
    "no-undef": "error",
    "no-unexpected-multiline": "error",
    "no-useless-assignment": "error",
    "preserve-caught-error": "error",

    "@stylistic/no-confusing-arrow": "error",
    "@stylistic/padding-line-between-statements": paddingLineBetweenStatements,

    "vite-plus/prefer-vite-plus-imports": "error",
  },
  options: {
    typeAware: false,
    typeCheck: false,
  },
};
